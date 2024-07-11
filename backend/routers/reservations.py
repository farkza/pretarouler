from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from schemas.reservation import ReservationResponse, ReservationCreate
import os
import logging
from db import *

router = APIRouter()

# Configuration MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = "pretarouler"
RESERVATIONS_COLLECTION = "reservations"
USERS_COLLECTION = "users"

# Connexion à MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
reservations_collection = db[RESERVATIONS_COLLECTION]
users_collection = db[USERS_COLLECTION]

def convert_objectid_to_str(doc):
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        doc.pop("_id")
    if "user" in doc:
        doc["user"] = str(doc["user"])
    if "car" in doc:
        doc["car"] = str(doc["car"])
    return doc

@router.get("/api/reservations/", response_model=list[ReservationResponse], tags=["Reservations"])
async def get_reservations():
    reservations = []
    try:
        for reservation in reservations_collection.find():
            logging.info(f"Avant conversion: {reservation}")
            reservation = convert_objectid_to_str(reservation)
            logging.info(f"Après conversion: {reservation}")
            reservations.append(reservation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return reservations

@router.get("/api/reservations/{reservation_id}", response_model=ReservationResponse, tags=["Reservations"])
async def get_reservation(reservation_id: str):
    try:
        reservation = reservations_collection.find_one({"_id": ObjectId(reservation_id)})
        if reservation is None:
            raise HTTPException(status_code=404, detail="Reservation not found")
        reservation = convert_objectid_to_str(reservation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return reservation

@router.post("/api/reservations/", response_model=ReservationResponse, tags=["Reservations"])
async def add_reservation(reservation: ReservationCreate):
    try:
        reservation_data = reservation.dict(by_alias=True)
        reservation_data["user"] = ObjectId(reservation_data["user"])
        reservation_data["car"] = ObjectId(reservation_data["car"])
        result = reservations_collection.insert_one(reservation_data)
        reservation_data["_id"] = str(result.inserted_id)

        # Ajouter l'ID de la réservation à l'utilisateur
        user_id = reservation_data["user"]
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"reservations": reservation_data["_id"]}}
        )

        return convert_objectid_to_str(reservation_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/reservations/{reservation_id}", response_model=ReservationResponse, tags=["Reservations"])
async def delete_reservation(reservation_id: str):
    try:
        reservation = reservations_collection.find_one({"_id": ObjectId(reservation_id)})
        if reservation is None:
            raise HTTPException(status_code=404, detail="Reservation not found")

        reservations_collection.delete_one({"_id": ObjectId(reservation_id)})

        # Retirer l'ID de la réservation de l'utilisateur
        user_id = reservation["user"]
        users_collection.update_one(
            {"_id": user_id},
            {"$pull": {"reservations": reservation_id}}
        )

        reservation = convert_objectid_to_str(reservation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return reservation
