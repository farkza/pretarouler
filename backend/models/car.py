from pydantic import BaseModel, Field

class Car(BaseModel):
    brand: str
    model: str
    horsepower: int
    autonomy: int
    acceleration_0_100: float = Field(..., alias="acceleration 0-100")
    GPS: bool
    air_conditioning: bool = Field(..., alias="air conditioning")
    fuel_consumption: float = Field(..., alias="fuel consumption")
    fuel_type: str = Field(..., alias="fuel type")
    price_per_day: int = Field(..., alias="price per day")
    city: str
    img: str = ""
