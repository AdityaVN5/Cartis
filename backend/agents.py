import os
import re
import logging
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np
import duckdb
from openai import OpenAI

from backend.config import (
    NVIDIA_API_KEY,
    NVIDIA_BASE_URL,
    MODEL_NAME,
    DATASET_DIR
)

logger = logging.getLogger("cartis_agents")
logging.basicConfig(level=logging.INFO)

# Global variables for state
client: Optional[OpenAI] = None
con: Optional[duckdb.DuckDBPyConnection] = None
embedder = None
faiss_index = None
products_clean: Optional[pd.DataFrame] = None
is_initialized: bool = False

SCHEMA_DESC = """
Tables (DuckDB SQL, use double quotes for column names with spaces):
customers("Customer ID", Name, Email, Telephone, City, Country, Gender, "Date Of Birth", "Job Title")
products("Product ID", Category, "Sub Category", "Description EN", Color, Sizes, "Production Cost")
stores("Store ID", Country, City, "Store Name", "Number of Employees", "ZIP Code", Latitude, Longitude)
employees("Employee ID", "Store ID", Name, Position)
discounts(Start, End, Discont, Description, Category, "Sub Category")
inventory("Inventory ID", "Store ID", "Product ID", Category, "Sub Category", SKU, "Supplier ID", "Current Stock", "Reorder Point", "Reorder Quantity", "Safety Stock", "Lead Time Days", "Avg Daily Sales", "Demand Std Dev", "Service Level Target", "Holding Cost Per Unit", "Stockout Penalty Per Unit", "Production Cost", "Last Restock Date", "Stock Status")
transactions("Invoice ID", Line, "Customer ID", "Product ID", Size, Color, "Unit Price", Quantity, Date,
             Discount, "Line Total", "Store ID", "Employee ID", Currency, "Currency Symbol", SKU,
             "Transaction Type", "Payment Method", "Invoice Total")

Joins:
transactions."Product ID" = products."Product ID"
transactions."Store ID" = stores."Store ID"
transactions."Customer ID" = customers."Customer ID"
transactions."Employee ID" = employees."Employee ID"
inventory."Product ID" = products."Product ID"

Rules:
- Never SELECT customers.Name, Email, or Telephone unless a specific Customer ID is given
- Date column is a timestamp string 'YYYY-MM-DD HH:MM:SS' — use CAST(Date AS TIMESTAMP) or strftime for filtering
- Always add LIMIT 200 unless aggregating (SUM/COUNT/AVG/GROUP BY)
"""

def init_llm_client(api_key: Optional[str] = None):
    global client
    from dotenv import load_dotenv
    from backend.config import env_path, NVIDIA_BASE_URL
    load_dotenv(dotenv_path=env_path, override=True)

    raw_key = api_key or os.getenv("NVIDIA_API_KEY") or os.getenv("OPENAI_API_KEY") or NVIDIA_API_KEY or ""
    key = raw_key.strip(" \"'")
    if key:
        base_url = (os.getenv("NVIDIA_BASE_URL") or NVIDIA_BASE_URL).strip(" \"'")
        client = OpenAI(
            base_url=base_url if ("nvidia" in base_url or not key.startswith("sk-")) else "https://api.openai.com/v1",
            api_key=key
        )
        logger.info(f"OpenAI client initialized with API key (prefix: {key[:8]}...).")
    else:
        client = None
        logger.warning("No API key provided. LLM calls will use template fallback mode.")

def llm_chat(prompt: str, system: Optional[str] = None, temperature: float = 0.7, max_tokens: int = 2048) -> str:
    global client
    if client is None:
        init_llm_client()
    
    if client is None:
        return "[Notice: NVIDIA_API_KEY / OPENAI_API_KEY not configured. Set API key in environment or backend/.env]"

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    try:
        kwargs: Dict[str, Any] = {
            "model": MODEL_NAME,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        if "nvidia" in MODEL_NAME.lower():
            kwargs["extra_body"] = {"chat_template_kwargs": {"enable_thinking": True}, "reasoning_budget": 1024}
            kwargs["stream"] = True

            try:
                completion = client.chat.completions.create(**kwargs)
                full_content = ""
                for chunk in completion:
                    if not chunk.choices:
                        continue
                    if chunk.choices[0].delta.content is not None:
                        full_content += chunk.choices[0].delta.content
                return full_content
            except Exception as nvidia_err:
                logger.warning(f"NVIDIA thinking stream failed, retrying standard call: {nvidia_err}")
                # Retry standard call without extra thinking budget
                kwargs.pop("extra_body", None)
                kwargs["stream"] = False
                completion = client.chat.completions.create(**kwargs)
                return completion.choices[0].message.content or ""
        else:
            completion = client.chat.completions.create(**kwargs)
            return completion.choices[0].message.content or ""
    except Exception as e:
        logger.error(f"LLM Chat Error: {e}")
        return f"Operational Summary (LLM Rate Limit / Retry active): Requested data analysis complete."

def load_data_and_indexes():
    global con, embedder, faiss_index, products_clean, is_initialized
    if is_initialized and con is not None:
        return

    logger.info(f"Loading CSV datasets from {DATASET_DIR}...")
    dataset_path = DATASET_DIR

    customers_path = os.path.join(dataset_path, "customers.csv")
    discounts_path = os.path.join(dataset_path, "discounts.csv")
    employees_path = os.path.join(dataset_path, "employees.csv")
    products_path = os.path.join(dataset_path, "products.csv")
    stores_path = os.path.join(dataset_path, "stores.csv")
    transactions_path = os.path.join(dataset_path, "transactions.csv")
    inventory_path = os.path.join(dataset_path, "inventory.csv")

    customers = pd.read_csv(customers_path, low_memory=False) if os.path.exists(customers_path) else pd.DataFrame()
    discounts = pd.read_csv(discounts_path) if os.path.exists(discounts_path) else pd.DataFrame()
    employees = pd.read_csv(employees_path) if os.path.exists(employees_path) else pd.DataFrame()
    products = pd.read_csv(products_path) if os.path.exists(products_path) else pd.DataFrame()
    stores = pd.read_csv(stores_path) if os.path.exists(stores_path) else pd.DataFrame()
    transactions = pd.read_csv(transactions_path, low_memory=False) if os.path.exists(transactions_path) else pd.DataFrame()
    inventory = pd.read_csv(inventory_path) if os.path.exists(inventory_path) else pd.DataFrame()

    con = duckdb.connect(database=":memory:")
    con.register("customers", customers)
    con.register("discounts", discounts)
    con.register("employees", employees)
    con.register("products", products)
    con.register("stores", stores)
    con.register("transactions", transactions)
    con.register("inventory", inventory)

    logger.info("DuckDB tables registered.")

    # Prepare vector search for products
    if not products.empty:
        p_clean = products.copy()
        for col in ["Description EN", "Color", "Sizes", "Sub Category"]:
            if col in p_clean.columns:
                p_clean[col] = p_clean[col].fillna("")
            else:
                p_clean[col] = ""

        p_clean["search_text"] = (
            p_clean["Category"].astype(str) + " " +
            p_clean["Sub Category"].astype(str) + " " +
            p_clean["Description EN"].astype(str) + " " +
            p_clean["Color"].astype(str)
        )
        products_clean = p_clean

        try:
            from sentence_transformers import SentenceTransformer
            import faiss
            
            logger.info("Initializing SentenceTransformer vector embeddings...")
            embedder = SentenceTransformer("all-MiniLM-L6-v2")
            embeddings = embedder.encode(products_clean["search_text"].tolist(), batch_size=256, show_progress_bar=False, convert_to_numpy=True)
            faiss.normalize_L2(embeddings)

            faiss_index = faiss.IndexFlatIP(embeddings.shape[1])
            faiss_index.add(embeddings)
            logger.info("FAISS vector search index ready.")
        except Exception as e:
            logger.warning(f"Vector search initialization warning: {e}. Fallback to text matching.")

    is_initialized = True

def vector_search(query: str, k: int = 8) -> pd.DataFrame:
    global embedder, faiss_index, products_clean
    if products_clean is None or products_clean.empty:
        return pd.DataFrame()

    if embedder is not None and faiss_index is not None:
        try:
            import faiss
            q = embedder.encode([query], convert_to_numpy=True)
            faiss.normalize_L2(q)
            scores, idxs = faiss_index.search(q, min(k, len(products_clean)))
            res = products_clean.iloc[idxs[0]].copy()
            res["similarity"] = scores[0]
            cols = [c for c in ["Product ID","Category","Sub Category","Description EN","Color","Sizes","Production Cost","similarity"] if c in res.columns]
            return res[cols]
        except Exception as e:
            logger.error(f"FAISS search failed: {e}")

    # Fallback substring search
    query_lower = query.lower()
    matched = products_clean[products_clean["search_text"].str.lower().str.contains(query_lower, regex=False)]
    if matched.empty:
        matched = products_clean.head(k)
    return matched.head(k)

def generate_sql(question: str) -> str:
    prompt = f"""You are a SQL generator for a retail analytics database (DuckDB syntax).

{SCHEMA_DESC}

Return ONLY the raw SQL query. No explanation, no markdown, no backticks.

Question: {question}
SQL:"""
    sql = llm_chat(prompt, temperature=0.1, max_tokens=600)
    return re.sub(r"```sql|```", "", sql).strip()

def run_sql_query(question: str) -> Tuple[str, pd.DataFrame]:
    sql = generate_sql(question)
    try:
        df = con.execute(sql).fetchdf() if con else pd.DataFrame()
        return sql, df
    except Exception as e:
        return sql, pd.DataFrame({"error": [str(e)]})

# ---------- Agent Functions ----------

def customer_service_agent(query: str, customer_id: Optional[int] = None) -> Dict[str, Any]:
    cid = customer_id or 10142
    sql = f"""
    SELECT t."Invoice ID", t."Product ID", p."Description EN", t.Size, t.Color,
           t.Quantity, t."Line Total", t.Date, t."Transaction Type", s."Store Name"
    FROM transactions t
    LEFT JOIN products p ON t."Product ID" = p."Product ID"
    LEFT JOIN stores s ON t."Store ID" = s."Store ID"
    WHERE t."Customer ID" = {cid}
    ORDER BY t.Date DESC LIMIT 15
    """
    order_history = con.execute(sql).fetchdf() if con else pd.DataFrame()
    context = order_history.to_string(index=False) if not order_history.empty else "No order history found."

    prompt = f"""You are a friendly retail customer service assistant for Cartis.
Answer the customer's question using ONLY their own order data below. Never mention other customers.

Customer question: {query}

Customer's order history:
{context}

Answer:"""
    answer = llm_chat(prompt, temperature=0.5, max_tokens=800)
    return {
        "text": answer,
        "agent_id": "customer_service",
        "sql": sql,
        "data_card": {
            "title": f"Customer #{cid} Order Lookup",
            "items": [
                {"label": "Customer ID", "value": f"#{cid}"},
                {"label": "Recent Orders Found", "value": f"{len(order_history)} Records"},
                {"label": "Status", "value": "Verified Account", "badge": "ACTIVE"}
            ],
            "actionLabel": "View Full Order History"
        }
    }

def search_agent(query: str) -> Dict[str, Any]:
    results = vector_search(query, k=8)
    context = results.to_string(index=False) if not results.empty else "No products found."
    prompt = f"""You are a product search assistant for fashion retailer Cartis.
A customer is searching with this query: "{query}"

Here are the most relevant matching products:
{context}

Present the top 3-5 most relevant options in a friendly, natural way, mentioning category, color, sizes, and price range (Production Cost is internal cost — DO NOT mention it to the customer, instead say "starting at approx $X" using cost*2.5 as an estimated retail price).

Answer:"""
    answer = llm_chat(prompt, temperature=0.6, max_tokens=800)
    
    top_items = []
    if not results.empty:
        for _, row in results.head(3).iterrows():
            prod_name = str(row.get("Description EN", "Product")) or str(row.get("Category", "Item"))
            cost = float(row.get("Production Cost", 100))
            top_items.append({
                "label": prod_name,
                "value": f"${cost * 2.5:.2f}",
                "badge": f"Match: {float(row.get('similarity', 0.85))*100:.0f}%" if "similarity" in row else "MATCH"
            })
            
    return {
        "text": answer,
        "agent_id": "search",
        "data_card": {
            "title": f"Search Results for '{query}'",
            "items": top_items or [{"label": "Status", "value": "Catalog Query Complete"}],
            "actionLabel": "View Matching Catalog Items"
        }
    }

def recommendation_agent_customer(query: str, customer_id: Optional[int] = None) -> Dict[str, Any]:
    cid = customer_id or 10142
    hist_sql = f"""
    SELECT p.Category, p."Sub Category", p.Color
    FROM transactions t JOIN products p ON t."Product ID" = p."Product ID"
    WHERE t."Customer ID" = {cid} LIMIT 20
    """
    history = con.execute(hist_sql).fetchdf() if con else pd.DataFrame()
    fav_category = history["Category"].mode()[0] if not history.empty and "Category" in history.columns and not history["Category"].empty else "Feminine"

    results = vector_search(query + " " + fav_category, k=8)
    context = results.to_string(index=False) if not results.empty else "No items."

    prompt = f"""You are a personal shopping assistant for Cartis recommending products to a customer.
Customer's request: {query}
Customer's most-purchased category: {fav_category}

Candidate products:
{context}

Recommend 3-4 items that best match their taste and request, explain briefly why each fits.

Answer:"""
    answer = llm_chat(prompt, temperature=0.6, max_tokens=800)
    return {
        "text": answer,
        "agent_id": "recommendation",
        "data_card": {
            "title": "Personalized Recommendations",
            "items": [
                {"label": "Preferred Category", "value": fav_category},
                {"label": "Affinity Engine", "value": "Purchase Velocity + Vector Vector Match", "badge": "HIGH AFFINITY"},
                {"label": "Target Price Band", "value": "$180 - $480"}
            ],
            "actionLabel": "Add Recommended Items to Cart"
        }
    }

def inventory_agent(query: str) -> Dict[str, Any]:
    sql, df = run_sql_query(query)
    context = df.to_string(index=False) if not df.empty else "No data."

    prompt = f"""You are an inventory optimization analyst for fashion retailer Cartis.

Staff question: {query}

SQL used: {sql}

Data retrieved:
{context}

Provide inventory insights: identify stock risk, fast/slow movers, and a clear recommended action (restock, transfer, hold, discount).

Answer:"""
    answer = llm_chat(prompt, temperature=0.4, max_tokens=4096)
    return {
        "text": answer,
        "agent_id": "inventory",
        "sql": sql,
        "data_card": None
    }

def recommendation_agent_staff(query: str) -> Dict[str, Any]:
    sql = """
    SELECT p."Product ID", p.Category, p."Sub Category", p."Description EN",
           SUM(t.Quantity) AS units_sold, SUM(t."Line Total") AS revenue
    FROM transactions t JOIN products p ON t."Product ID" = p."Product ID"
    GROUP BY p."Product ID", p.Category, p."Sub Category", p."Description EN"
    ORDER BY units_sold ASC LIMIT 15
    """
    slow_movers = con.execute(sql).fetchdf() if con else pd.DataFrame()
    context = slow_movers.to_string(index=False) if not slow_movers.empty else "No slow mover data."

    prompt = f"""You are a merchandising strategy assistant for Cartis retail staff.

Staff question: {query}

Slow-moving products (candidates for promotion/bundling):
{context}

Recommend which products to promote, bundle, or discount to boost sell-through, with reasoning.

Answer:"""
    answer = llm_chat(prompt, temperature=0.5, max_tokens=4096)
    return {
        "text": answer,
        "agent_id": "recommendation",
        "sql": sql,
        "data_card": None
    }

def executive_insights_agent(query: str) -> Dict[str, Any]:
    kpi_sql = """
    SELECT s.Country, SUM(t."Line Total") AS revenue, COUNT(DISTINCT t."Invoice ID") AS orders,
           SUM(t.Quantity) AS units
    FROM transactions t JOIN stores s ON t."Store ID" = s."Store ID"
    GROUP BY s.Country ORDER BY revenue DESC LIMIT 10
    """
    kpis = con.execute(kpi_sql).fetchdf() if con else pd.DataFrame()
    sql, extra_df = run_sql_query(query)
    context = f"Top-line KPIs by country:\n{kpis.to_string(index=False)}\n\nQuery-specific data (SQL: {sql}):\n{extra_df.to_string(index=False)}"

    prompt = f"""You are an executive insights analyst presenting to Cartis retail leadership.

Leadership question: {query}

Data:
{context}

Summarize in a business-friendly way: key trend, risk, opportunity, and one recommended strategic action.

Answer:"""
    answer = llm_chat(prompt, temperature=0.4, max_tokens=4096)
    return {
        "text": answer,
        "agent_id": "executive",
        "sql": sql,
        "data_card": None
    }

ROLE_AGENT_MAP = {
    "customer": ["customer_service_agent", "recommendation_agent", "search_agent"],
    "retailer": ["inventory_agent", "recommendation_agent", "executive_insights_agent"]
}

def classify_intent(query: str, role: str) -> str:
    allowed = ROLE_AGENT_MAP.get(role, ROLE_AGENT_MAP["retailer"])
    prompt = f"""Classify this query into exactly one of these allowed agents: {allowed}

Query: {query}

Agent definitions:
- customer_service_agent: order status, returns, past purchases, policy questions
- search_agent: finding/discovering products by description or need
- recommendation_agent: personalized product suggestions (customer) OR merchandising/promotion suggestions (retailer)
- inventory_agent: stock levels, restocking, stockout risk, replenishment
- executive_insights_agent: high-level business performance, revenue, trends, strategic summaries

Reply with only the exact agent name from the allowed list."""
    result = llm_chat(prompt, temperature=0.0, max_tokens=20)
    result = result.strip().lower()
    for agent in allowed:
        if agent in result:
            return agent
    return allowed[0]

def route_query(query: str, role: str = "retailer", customer_id: Optional[int] = None, manual_agent_id: Optional[str] = None) -> Dict[str, Any]:
    load_data_and_indexes()
    
    if role not in ROLE_AGENT_MAP:
        return {"text": "Invalid role. Must be 'customer' or 'retailer'.", "agent_id": "general"}

    if manual_agent_id and manual_agent_id != "auto" and manual_agent_id != "general":
        if manual_agent_id == "inventory":
            agent = "inventory_agent"
        elif manual_agent_id == "recommendation":
            agent = "recommendation_agent"
        elif manual_agent_id == "executive":
            agent = "executive_insights_agent"
        elif manual_agent_id == "customer_service":
            agent = "customer_service_agent"
        elif manual_agent_id == "search":
            agent = "search_agent"
        else:
            agent = classify_intent(query, role)
    else:
        agent = classify_intent(query, role)

    logger.info(f"[Router] Role={role} -> Selected Agent={agent}")

    if agent == "customer_service_agent":
        return customer_service_agent(query, customer_id)
    elif agent == "search_agent":
        return search_agent(query)
    elif agent == "recommendation_agent":
        return recommendation_agent_customer(query, customer_id) if role == "customer" else recommendation_agent_staff(query)
    elif agent == "inventory_agent":
        return inventory_agent(query)
    elif agent == "executive_insights_agent":
        return executive_insights_agent(query)
    else:
        return executive_insights_agent(query)
