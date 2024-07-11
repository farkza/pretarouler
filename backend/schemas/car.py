# schemas/car.py

from pydantic import BaseModel, Field
class CarBase(BaseModel):
    brand: str
    model: str
    horsepower: int
    autonomy: int
    acceleration_0_100: float = Field(..., alias="acceleration_0_100")
    GPS: bool
    air_conditioning: bool = Field(..., alias="air_conditioning")
    fuel_consumption: float = Field(..., alias="fuel_consumption")
    fuel_type: str = Field(..., alias="fuel_type")
    price_per_day: int = Field(..., alias="price_per_day")
    city: str
    img: str = ""
class CarCreate(CarBase):
    pass
class CarResponse(CarBase):
    id: str
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
