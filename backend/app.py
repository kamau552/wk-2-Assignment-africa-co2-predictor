from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import numpy as np

app = FastAPI(title="Africa CO₂ Emission Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and dataset (remove "backend/" prefix since you're running from backend folder)
model = joblib.load("africa_co2_model.pkl")
data = pd.read_csv("Africa_CO2_Climate.csv")
data["Country_Code"] = data["Country"].astype("category").cat.codes

# Pydantic models
class CO2Input(BaseModel):
    Year: int
    Avg_Temperature: float
    Energy_Use: float
    GDP: float
    Population: float
    Country_Code: float

class CountryInput(BaseModel):
    country: str

@app.get("/")
def home():
    return {"message": "Welcome to the Africa CO₂ Emission Prediction API!"}

# Combined endpoint that handles both country name and manual input
@app.post("/predict")
def predict_co2(request: dict):
    try:
        # Check if it's a country-based prediction
        if "country" in request:
            country_name = request["country"]
            
            # Get country data
            country_data = data[data["Country"] == country_name]
            
            if country_data.empty:
                return {"error": f"Country '{country_name}' not found"}
            
            # Get the latest row for prediction
            latest_row = country_data.iloc[-1]
            country_code = latest_row["Country_Code"]
            
            # Simulate future data (2030 prediction)
            future_year = 2030
            future_temp = latest_row["Avg_Temperature"] + 0.4
            future_energy = latest_row["Energy_Use"] * 1.1
            future_gdp = latest_row["GDP"] * 1.2
            future_pop = latest_row["Population"] * 1.1
            
            # Create DataFrame with proper column names to avoid warning
            X_pred = pd.DataFrame([[
                future_year,
                future_temp,
                future_energy,
                future_gdp,
                future_pop,
                country_code
            ]], columns=["Year", "Avg_Temperature", "Energy_Use", "GDP", "Population", "Country_Code"])
            
            prediction = model.predict(X_pred)[0]
            
            # Return historical data + prediction
            historical = country_data[["Year", "CO2_Emissions", "Avg_Temperature", "Energy_Use", "GDP", "Population"]].to_dict(orient="records")
            
            return {
                "country": country_name,
                "year": future_year,
                "predicted_emission": float(prediction),
                "last_year_emission": float(latest_row["CO2_Emissions"]),
                "change_percent": round(((prediction - latest_row["CO2_Emissions"]) / latest_row["CO2_Emissions"]) * 100, 2),
                "trend": "increase" if prediction > latest_row["CO2_Emissions"] else "decrease",
                "unit": "metric tons of CO₂",
                "historical": historical
            }
        
        # Manual input prediction
        else:
            year = int(request["Year"])
            avg_temp = float(request["Avg_Temperature"])
            energy_use = float(request["Energy_Use"])
            gdp = float(request["GDP"])
            population = float(request["Population"])
            country_code = float(request["Country_Code"])
            
            # Create DataFrame with proper column names
            X_pred = pd.DataFrame([[
                year, avg_temp, energy_use, gdp, population, country_code
            ]], columns=["Year", "Avg_Temperature", "Energy_Use", "GDP", "Population", "Country_Code"])
            
            prediction = model.predict(X_pred)[0]
            
            return {
                "Predicted_CO2_Emission": round(prediction, 3),
                "predicted_emission": round(prediction, 3)
            }
    
    except Exception as e:
        return {"error": str(e)}

# ✅ Add a GET endpoint for testing
@app.get("/countries")
def get_countries():
    """Return list of available countries"""
    return {"countries": data["Country"].unique().tolist()}