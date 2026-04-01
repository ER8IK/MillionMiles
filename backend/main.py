import json
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Encar MVP API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).parent / "cars.json"


# ── Models ────────────────────────────────────────────────────────────────────

class Car(BaseModel):
    brand: str
    model: str
    year: str
    mileage: str
    price: str
    image: str
    detail_url: str
    scraped_at: str


class CarsResponse(BaseModel):
    updated_at: str
    count: int
    cars: list[Car]


# ── Helpers ───────────────────────────────────────────────────────────────────

def load_data() -> dict:
    if not DATA_FILE.exists():
        return {
            "updated_at": datetime.utcnow().isoformat(),
            "count": 0,
            "cars": [],
        }
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "message": "Encar MVP API is running"}


@app.get("/cars", response_model=CarsResponse, tags=["cars"])
def get_cars():
    """Return all parsed car listings."""
    try:
        data = load_data()
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/cars/{index}", response_model=Car, tags=["cars"])
def get_car(index: int):
    """Return a single car by its list index."""
    data = load_data()
    cars = data.get("cars", [])
    if index < 0 or index >= len(cars):
        raise HTTPException(status_code=404, detail="Car not found")
    return cars[index]
