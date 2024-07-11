from pydantic import BaseModel, Field
from datetime import datetime

class ReservationBase(BaseModel):
    start_date: datetime = Field(..., alias="start_date")
    end_date: datetime = Field(..., alias="end_date")
    price: int
    city: str
    user: str = Field(..., alias="user")
    car: str = Field(..., alias="car")

class ReservationCreate(ReservationBase):
    pass

class ReservationResponse(ReservationBase):
    id: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
