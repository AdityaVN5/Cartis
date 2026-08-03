import time
import logging
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.config import PORT, HOST, NVIDIA_API_KEY
from backend.agents import (
    load_data_and_indexes,
    init_llm_client,
    route_query,
    inventory_agent,
    recommendation_agent_staff,
    executive_insights_agent,
    customer_service_agent,
    search_agent
)

logger = logging.getLogger("cartis_backend")

app = FastAPI(
    title="Cartis Agentic AI Analytics API",
    description="FastAPI service wrapping agentic AI for Retail Command Center AI Copilot and Customer Care.",
    version="1.0.0"
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Cartis FastAPI Backend Service...")
    init_llm_client()
    try:
        load_data_and_indexes()
        logger.info("Data and indexes pre-loaded successfully.")
    except Exception as e:
        logger.error(f"Error pre-loading data on startup: {e}")

class ChatRequest(BaseModel):
    query: str = Field(..., description="User query or command string")
    role: str = Field("retailer", description="User role: 'retailer' or 'customer'")
    customer_id: Optional[int] = Field(None, description="Customer ID for customer-specific queries")
    agent_id: Optional[str] = Field("auto", description="Selected agent: 'auto', 'inventory', 'recommendation', 'executive', 'customer_service', 'search'")
    api_key: Optional[str] = Field(None, description="Optional per-request API Key")

class DataCardItem(BaseModel):
    label: str
    value: str
    badge: Optional[str] = None

class DataCard(BaseModel):
    title: str
    items: List[DataCardItem]
    actionLabel: Optional[str] = None

class ChatResponse(BaseModel):
    id: str
    sender: str = "copilot"
    text: str
    time: str
    agent_id: str
    dataCard: Optional[Dict[str, Any]] = None
    sql: Optional[str] = None

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Cartis Agentic AI Backend",
        "has_api_key": bool(NVIDIA_API_KEY),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest, x_api_key: Optional[str] = Header(None)):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    # Ensure API key is loaded / re-initialized from .env, request body, or header
    key = req.api_key or x_api_key
    init_llm_client(key)

    res = route_query(
        query=req.query,
        role=req.role,
        customer_id=req.customer_id,
        manual_agent_id=req.agent_id
    )

    current_time = time.strftime("%I:%M %p")
    
    return ChatResponse(
        id=f"cpl-{int(time.time() * 1000)}",
        sender="copilot",
        text=res.get("text", ""),
        time=current_time,
        agent_id=res.get("agent_id", "general"),
        dataCard=res.get("data_card"),
        sql=res.get("sql")
    )

@app.post("/api/agents/inventory")
def api_inventory_agent(req: ChatRequest):
    res = inventory_agent(req.query)
    return res

@app.post("/api/agents/recommendation")
def api_recommendation_agent(req: ChatRequest):
    if req.role == "customer":
        from backend.agents import recommendation_agent_customer
        res = recommendation_agent_customer(req.query, req.customer_id)
    else:
        res = recommendation_agent_staff(req.query)
    return res

@app.post("/api/agents/executive")
def api_executive_agent(req: ChatRequest):
    res = executive_insights_agent(req.query)
    return res

@app.post("/api/agents/customer-service")
def api_customer_service_agent(req: ChatRequest):
    res = customer_service_agent(req.query, req.customer_id)
    return res

@app.post("/api/agents/search")
def api_search_agent(req: ChatRequest):
    res = search_agent(req.query)
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
