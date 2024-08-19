from fastapi import APIRouter, HTTPException
from bson import ObjectId
from db import db
from schemas.reservation import ReservationResponse, ReservationCreate
import logging

router = APIRouter()
reservations_collection = db.get_collection("reservations")
users_collection = db.get_collection("users")

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
    try:
        reservations = [convert_objectid_to_str(reservation) for reservation in reservations_collection.find()]
        logging.info(f"Retrieved {len(reservations)} reservations")
        return reservations
    except Exception as e:
        logging.error(f"Failed to fetch reservations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/reservations/{reservation_id}", response_model=ReservationResponse, tags=["Reservations"])
async def get_reservation(reservation_id: str):
    try:
        reservation = reservations_collection.find_one({"_id": ObjectId(reservation_id)})
        if reservation:
            return convert_objectid_to_str(reservation)
        else:
            raise HTTPException(status_code=404, detail="Reservation not found")
    except Exception as e:
        logging.error(f"Failed to fetch reservation {reservation_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/reservations/", response_model=ReservationResponse, tags=["Reservations"])
async def add_reservation(reservation: ReservationCreate):
    try:
        reservation_data = reservation.dict(by_alias=True)
        reservation_data["user"] = ObjectId(reservation_data["user"])
        reservation_data["car"] = ObjectId(reservation_data["car"])
        
        result = reservations_collection.insert_one(reservation_data)
        reservation_id = str(result.inserted_id)
        
        # Ajouter l'ID de la réservation à l'utilisateur
        user_id = reservation_data["user"]
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"reservations": reservation_id}}
        )

        reservation_data["_id"] = reservation_id
        return convert_objectid_to_str(reservation_data)
    except Exception as e:
        logging.error(f"Failed to add reservation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/reservations/{reservation_id}", response_model=ReservationResponse, tags=["Reservations"])
async def delete_reservation(reservation_id: str):
    try:
        reservation = reservations_collection.find_one({"_id": ObjectId(reservation_id)})
        if not reservation:
            raise HTTPException(status_code=404, detail="Reservation not found")

        reservations_collection.delete_one({"_id": ObjectId(reservation_id)})

        # Retirer l'ID de la réservation de l'utilisateur
        user_id = reservation["user"]
        users_collection.update_one(
            {"_id": user_id},
            {"$pull": {"reservations": reservation_id}}
        )

        return convert_objectid_to_str(reservation)
    except Exception as e:
        logging.error(f"Failed to delete reservation {reservation_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
