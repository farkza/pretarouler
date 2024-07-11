from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime

class ReservationCreate(BaseModel):
    start_date: datetime
    end_date: datetime
    user_id: str = Field(..., alias='user')  # Utilisation de str pour recevoir ObjectId en POST
    car_id: str = Field(..., alias='car')    # Utilisation de str pour recevoir ObjectId en POST
    price: float
    city: str

def convert_reservation_to_dict(reservation):
    reservation_dict = reservation.copy()
    reservation_dict["_id"] = str(reservation["_id"])  # Convertir ObjectId en str
    
    # Vérifier si les clés 'user' et 'car' existent dans le dictionnaire
    if 'user' in reservation_dict:
        reservation_dict["user"] = str(reservation["user"])  # Convertir ObjectId en str
    if 'car' in reservation_dict:
        reservation_dict["car"] = str(reservation["car"])  # Convertir ObjectId en str
    
    return reservation_dict
