# routers/cars.py

from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from schemas.car import CarResponse, CarCreate
import os
import logging
from db import *

router = APIRouter()

# Configuration MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = "pretarouler"
COLLECTION_NAME = "cars"

# Connexion à MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def convert_objectid_to_str(doc):
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        doc.pop("_id")
    return doc

@router.get("/api/cars/", response_model=list[CarResponse], tags=["Cars"])
async def get_cars():
    cars = []
    try:
        for car in collection.find():
            logging.info(f"Avant conversion: {car}")
            car = convert_objectid_to_str(car)
            logging.info(f"Après conversion: {car}")
            cars.append(car)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return cars

@router.get("/api/cars/{car_id}", response_model=CarResponse, tags=["Cars"])
async def get_car(car_id: str):
    try:
        car = collection.find_one({"_id": ObjectId(car_id)})
        if car is None:
            raise HTTPException(status_code=404, detail="Car not found")
        car = convert_objectid_to_str(car)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return car

@router.post("/api/cars/", response_model=CarResponse, tags=["Cars"])
async def add_car(car: CarCreate):
    try:
        car_data = car.dict(by_alias=True)
        result = collection.insert_one(car_data)
        car_data["_id"] = str(result.inserted_id)
        return convert_objectid_to_str(car_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
