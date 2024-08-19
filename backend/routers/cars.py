from fastapi import APIRouter, HTTPException
from bson import ObjectId
from db import db
from schemas.car import CarResponse, CarCreate
import logging

router = APIRouter()
collection = db.get_collection("cars")

def convert_objectid_to_str(doc):
    doc["id"] = str(doc.pop("_id"))
    return doc

@router.get("/api/cars/", response_model=list[CarResponse], tags=["Cars"])
async def get_cars():
    try:
        cars = [convert_objectid_to_str(car) for car in collection.find()]
        logging.info(f"Retrieved {len(cars)} cars")
        return cars
    except Exception as e:
        logging.error(f"Failed to fetch cars: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/cars/{car_id}", response_model=CarResponse, tags=["Cars"])
async def get_car(car_id: str):
    try:
        car = collection.find_one({"_id": ObjectId(car_id)})
        if car:
            return convert_objectid_to_str(car)
        else:
            raise HTTPException(status_code=404, detail="Car not found")
    except Exception as e:
        logging.error(f"Failed to fetch car {car_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/cars/", response_model=CarResponse, tags=["Cars"])
async def add_car(car: CarCreate):
    try:
        car_data = car.dict(by_alias=True)
        result = collection.insert_one(car_data)
        car_data["_id"] = str(result.inserted_id)
        return convert_objectid_to_str(car_data)
    except Exception as e:
        logging.error(f"Failed to add car: {e}")
        raise HTTPException(status_code=500, detail=str(e))
