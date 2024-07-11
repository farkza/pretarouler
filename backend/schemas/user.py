from pydantic import BaseModel
from typing import List
class UserCreate(BaseModel):
    name: str
    first_name: str
    age: int
    email: str
    main_activity: str
    status: str
    phone_number: str
    password: str
    city: str
    reservations: List[str] = []
class UserLogin(BaseModel):
    email: str
    password: str
