import os
import joblib
import numpy as np
import pandas as pd
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

_FORECAST_CACHE = None

def preprocess_for_inference(transactions_path, products_path):
    """
    Ingests raw CSV files and reconstructs the strict 35-feature matrix
    required by the trained LightGBM model.
    """
    print("Loading raw data...")
    # 1. Load Data
    transactions = pd.read_csv(
        transactions_path,
        low_memory=False,
        usecols=["Product ID", "Store ID", "Date", "Quantity", "Unit Price", "Discount", "Transaction Type"]
    )
    products = pd.read_csv(
        products_path,
        usecols=["Product ID", "Category", "Sub Category", "Production Cost"]
    )

    # 2. Clean and Rename
    transactions = transactions.rename(columns={
        "Product ID": "Product_ID",
        "Store ID": "Store_ID",
        "Quantity": "units_sold",
        "Unit Price": "unit_price",
        "Transaction Type": "transaction_type"
    })

    products = products.rename(columns={
        "Product ID": "Product_ID",
        "Sub Category": "Sub_Category",
        "Production Cost": "production_cost"
    })

    transactions["Date"] = pd.to_datetime(transactions["Date"], errors="coerce")
    transactions["units_sold"] = pd.to_numeric(transactions["units_sold"], errors="coerce")
    transactions["unit_price"] = pd.to_numeric(transactions["unit_price"], errors="coerce")
    transactions["Discount"] = pd.to_numeric(transactions["Discount"], errors="coerce").fillna(0)

    transactions = transactions.dropna(subset=["Date", "Store_ID", "Product_ID", "units_sold"])
    transactions = transactions[transactions["units_sold"] > 0].copy()

    # 3. Aggregate to Daily Store-Product Demand
    print("Aggregating daily sales...")
    daily_sales = (
        transactions
        .groupby(["Date", "Store_ID", "Product_ID"], as_index=False)
        .agg(
            units_sold=("units_sold", "sum"),
            avg_unit_price=("unit_price", "mean"),
            avg_discount=("Discount", "mean"),
            transaction_count=("units_sold", "size")
        )
    )

    # 4. Merge Metadata & Time Features
    print("Engineering temporal features...")
    daily_sales = daily_sales.merge(products, on="Product_ID", how="left")

    daily_sales["year"] = daily_sales["Date"].dt.year
    daily_sales["month"] = daily_sales["Date"].dt.month
    daily_sales["quarter"] = daily_sales["Date"].dt.quarter
    daily_sales["week_of_year"] = daily_sales["Date"].dt.isocalendar().week.astype("int16")
    daily_sales["day_of_week"] = daily_sales["Date"].dt.dayofweek
    daily_sales["day_of_month"] = daily_sales["Date"].dt.day
    daily_sales["is_weekend"] = (daily_sales["day_of_week"] >= 5).astype("int8")

    daily_sales["month_sin"] = np.sin(2 * np.pi * daily_sales["month"] / 12)
    daily_sales["month_cos"] = np.cos(2 * np.pi * daily_sales["month"] / 12)
    daily_sales["week_sin"] = np.sin(2 * np.pi * daily_sales["week_of_year"] / 52)
    daily_sales["week_cos"] = np.cos(2 * np.pi * daily_sales["week_of_year"] / 52)

    # 5. Create Lags and Rolling Windows
    print("Calculating historical lags (this requires >= 29 days of data)...")
    daily_sales = daily_sales.sort_values(["Store_ID", "Product_ID", "Date"]).reset_index(drop=True)
    grouped_sales = daily_sales.groupby(["Store_ID", "Product_ID"], observed=True)["units_sold"]

    for lag in [1, 2, 3, 7, 14, 28]:
        daily_sales[f"lag_{lag}"] = grouped_sales.shift(lag)

    for window in [7, 14, 28]:
        shifted_sales = grouped_sales.shift(1)
        daily_sales[f"roll_mean_{window}"] = shifted_sales.groupby(
            [daily_sales["Store_ID"], daily_sales["Product_ID"]], observed=True
        ).transform(lambda x: x.rolling(window, min_periods=3).mean())

        daily_sales[f"roll_std_{window}"] = shifted_sales.groupby(
            [daily_sales["Store_ID"], daily_sales["Product_ID"]], observed=True
        ).transform(lambda x: x.rolling(window, min_periods=3).std())

        daily_sales[f"roll_max_{window}"] = shifted_sales.groupby(
            [daily_sales["Store_ID"], daily_sales["Product_ID"]], observed=True
        ).transform(lambda x: x.rolling(window, min_periods=3).max())

    daily_sales["pct_change_lag1"] = (
        (daily_sales["lag_1"] - daily_sales["lag_2"]) / (daily_sales["lag_2"].abs() + 1)
    ).clip(-5, 5)

    feat = daily_sales.dropna(subset=["lag_28"]).copy()
    rolling_std_cols = ["roll_std_7", "roll_std_14", "roll_std_28"]
    feat[rolling_std_cols] = feat[rolling_std_cols].fillna(0)

    # 6. Categorical Formatting
    categorical_cols = ["Store_ID", "Product_ID", "Category", "Sub_Category"]
    categorical_cols = [col for col in categorical_cols if col in feat.columns]

    for col in categorical_cols:
        feat[col] = feat[col].fillna("Unknown").astype("category")

    # 7. Final Selection
    feature_cols = [
        "Store_ID", "Product_ID", "Category", "Sub_Category",
        "avg_unit_price", "avg_discount", "transaction_count", "production_cost",
        "year", "month", "quarter", "week_of_year", "day_of_week", "day_of_month",
        "is_weekend", "month_sin", "month_cos", "week_sin", "week_cos",
        "lag_1", "lag_2", "lag_3", "lag_7", "lag_14", "lag_28",
        "roll_mean_7", "roll_std_7", "roll_max_7",
        "roll_mean_14", "roll_std_14", "roll_max_14",
        "roll_mean_28", "roll_std_28", "roll_max_28",
        "pct_change_lag1"
    ]

    X_inference = feat[feature_cols].copy()

    numeric_features = [col for col in feature_cols if col not in categorical_cols]
    for col in numeric_features:
        if X_inference[col].isnull().any():
            X_inference[col] = X_inference[col].fillna(X_inference[col].median())

    print(f"Preprocessing complete. Matrix shape: {X_inference.shape}")
    return X_inference, feat[["Date", "Store_ID", "Product_ID", "Category", "Sub_Category", "avg_unit_price", "units_sold"]]

def get_demand_predictions(transactions_path=None, products_path=None, stores_path=None, model_path=None, force_reload=False):
    """
    Loads LightGBM model and generates live demand predictions from dataset.
    Returns structured dict with dailySeries and tableData for frontend consumption.
    """
    global _FORECAST_CACHE
    if _FORECAST_CACHE is not None and not force_reload:
        return _FORECAST_CACHE

    base_dir = Path(__file__).resolve().parent
    dataset_dir = base_dir.parent / "dataset"

    if transactions_path is None:
        transactions_path = str(dataset_dir / "transactions.csv")
    if products_path is None:
        products_path = str(dataset_dir / "products.csv")
    if stores_path is None:
        stores_path = str(dataset_dir / "stores.csv")
    if model_path is None:
        model_path = str(base_dir / "lgbm_demand_model.pkl")

    if not os.path.exists(transactions_path) or not os.path.exists(products_path) or not os.path.exists(model_path):
        print(f"Warning: File missing for model inference. Check paths: {transactions_path}, {model_path}")
        return None

    # Load store & product metadata for enrichment
    stores_df = pd.read_csv(stores_path) if os.path.exists(stores_path) else pd.DataFrame()
    products_df = pd.read_csv(products_path) if os.path.exists(products_path) else pd.DataFrame()

    store_map = {}
    country_map = {}
    if not stores_df.empty and "Store ID" in stores_df.columns:
        for _, row in stores_df.iterrows():
            sid = row["Store ID"]
            store_map[sid] = str(row.get("Store Name", f"Store #{sid}"))
            country_map[sid] = str(row.get("Country", "China"))

    prod_desc_map = {}
    if not products_df.empty and "Product ID" in products_df.columns:
        for _, row in products_df.iterrows():
            pid = row["Product ID"]
            desc = str(row.get("Description EN", "")).strip()
            cat = str(row.get("Category", "Apparel"))
            sub = str(row.get("Sub Category", "Items"))
            prod_desc_map[pid] = desc if desc else f"{sub} #{pid}"

    # 1. Reconstruct feature matrix
    X_infer, meta_infer = preprocess_for_inference(transactions_path, products_path)

    # 2. Load model
    print(f"Loading LightGBM model from {model_path}...")
    loaded_model = joblib.load(model_path)

    # 3. Generate predictions
    preds = loaded_model.predict(X_infer)
    results_df = meta_infer.copy()
    results_df["predicted_demand"] = np.clip(preds, 0, None)

    # 4. Format Daily Time Series
    results_df["Date"] = pd.to_datetime(results_df["Date"]).dt.normalize()
    unique_dates = sorted(results_df["Date"].unique())

    daily_agg = results_df.groupby("Date", as_index=False).agg({
        "units_sold": "sum",
        "predicted_demand": "sum"
    }).sort_values("Date")


    std_err = 0.4081
    daily_series = []
    for idx, row in daily_agg.iterrows():
        d = row["Date"]
        hist_val = round(float(row["units_sold"]))
        pred_val = round(float(row["predicted_demand"]))
        upper_val = round(pred_val * (1 + std_err * 0.15))
        lower_val = round(max(0, pred_val * (1 - std_err * 0.15)))

        daily_series.append({
            "dayOffset": idx,
            "date": d.strftime("%b %d"),
            "fullDate": d.strftime("%Y-%m-%d"),
            "historicalSales": hist_val,
            "forecastDemand": pred_val,
            "upperBand": upper_val,
            "lowerBand": lower_val
        })

    # 5. Format Line Item Table Matrix
    table_rows = []
    # Sample top 200 distinct store-product date rows for line item table
    sampled_df = results_df.sort_values("Date", ascending=False).head(250)

    for idx, row in sampled_df.iterrows():
        pid = row["Product_ID"]
        sid = row["Store_ID"]
        date_str = row["Date"].strftime("%b %d")
        day_offset = (row["Date"] - unique_dates[0]).days if unique_dates else idx
        
        prod_name = prod_desc_map.get(pid, f"Product #{pid}")
        cat = str(row.get("Category", "Feminine"))
        subcat = str(row.get("Sub_Category", "Coats and Blazers"))
        store_name = store_map.get(sid, f"Store #{sid}")
        country_name = country_map.get(sid, "China")
        
        unit_qty = int(round(float(row["predicted_demand"])))
        unit_price = float(row.get("avg_unit_price", 180.0))
        line_total = round(unit_qty * unit_price, 2)
        
        hist_qty = float(row["units_sold"])
        diff_pct = (unit_qty - hist_qty) / (hist_qty + 1)
        trend = "Up" if diff_pct > 0.05 else ("Down" if diff_pct < -0.05 else "Stable")

        table_rows.append({
            "id": f"lgbm-f-{idx}",
            "dayOffset": day_offset,
            "date": date_str,
            "product": prod_name,
            "category": cat,
            "subcategory": subcat,
            "store": store_name,
            "country": country_name,
            "quantity": unit_qty,
            "unitPrice": unit_price,
            "lineTotal": line_total,
            "trend": trend
        })

    output_payload = {
        "status": "success",
        "model_version": "LightGBM v3.4 (lgbm_demand_model.pkl)",
        "total_records_processed": len(results_df),
        "dailySeries": daily_series,
        "tableData": table_rows
    }

    _FORECAST_CACHE = output_payload
    return output_payload


if __name__ == "__main__":
    res = get_demand_predictions()
    if res:
        print(f"Success! Daily series points: {len(res['dailySeries'])}, Table items: {len(res['tableData'])}")