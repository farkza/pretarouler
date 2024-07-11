from fastapi import FastAPI, APIRouter, HTTPException
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field
from schemas.reservation import ReservationCreate, convert_reservation_to_dict

app = FastAPI()

router = APIRouter()

load_dotenv()

# Configuration MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = "pretarouler"
COLLECTION_NAME = "reservations"

# Connexion à MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

@router.get("/api/reservations/", tags=["Reservations"])
async def get_reservations():
    try:
        reservations = list(collection.find())
        return [convert_reservation_to_dict(reservation) for reservation in reservations]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/reservations/", tags=["Reservations"])
async def create_reservation(reservation: ReservationCreate):
    try:
        # Convertir les champs user_id et car_id de str à ObjectId
        reservation_dict = reservation.dict()
        reservation_dict['user'] = ObjectId(reservation_dict['user_id'])
        reservation_dict['car'] = ObjectId(reservation_dict['car_id'])
        del reservation_dict['user_id']
        del reservation_dict['car_id']
        
        result = collection.insert_one(reservation_dict)
        inserted_id = result.inserted_id
        
        # Ajouter l'id inséré dans le dictionnaire de réservation
        reservation_dict["_id"] = str(inserted_id)  # Convertir ObjectId en str pour la réponse
        
        return reservation_dict
    
    except HTTPException:
        raise  # Reraise HTTPException to preserve status code
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/reservations/{reservation_id}", tags=["Reservations"])
async def get_reservation(reservation_id: str):
    try:
        obj_id = ObjectId(reservation_id)
        reservation = collection.find_one({"_id": obj_id})
        
        if reservation:
            return convert_reservation_to_dict(reservation)
        else:
            raise HTTPException(status_code=404, detail="Reservation not found")
    
    except HTTPException:
        raise  # Reraise HTTPException to preserve status code
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Inclure le routeur dans l'application FastAPI
app.include_router(router)
