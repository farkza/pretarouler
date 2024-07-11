from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from passlib.context import CryptContext
from bson import ObjectId
from schemas.user import UserCreate, UserLogin
from auth import create_access_token, create_refresh_token, verify_token
import os
from jose import JWTError
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")
ALGORITHM = "HS256"

# Configuration MongoDB
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = "pretarouler"
COLLECTION_NAME = "users"

# Connexion à MongoDB
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Configuration du cryptage du mot de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(email: str):
    user = collection.find_one({"email": email})
    return user

@router.post("/api/create_user/", response_model=UserCreate, tags=["Users"])
async def create_user(user: UserCreate):
    try:
        hashed_password = hash_password(user.password)
        user_data = user.dict(by_alias=True)
        user_data["password"] = hashed_password
        result = collection.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/login", tags=["Authentication"])
async def login(user_login: UserLogin):
    user = get_user(user_login.email)
    if not user or not verify_password(user_login.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": user_login.email})
    refresh_token = create_refresh_token(data={"sub": user_login.email})
    city = user.get("city", "")
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "city": city}

@router.post("/api/refresh_token", tags=["Authentication"])
async def refresh_token(refresh_token: str):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(refresh_token, credentials_exception)
    new_access_token = create_access_token(data={"sub": token_data.email})
    return {"access_token": new_access_token, "token_type": "bearer"}

@router.delete("/api/delete_user/{user_id}", tags=["Users"])
async def delete_user(user_id: str):
    try:
        result = collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 1:
            return {"message": "User deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/get_user/", tags=["Users"])
async def get_user_by_email(email: str):
    user = get_user(email)
    if user:
        user["_id"] = str(user["_id"])  # Convertir l'ObjectId en une chaîne pour la réponse JSON
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@router.get("/api/get_user_by_token/{token}", tags=["Users"])
async def get_user_by_token(token: str):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    user = get_user(token_data.email)
    if user:
        user["_id"] = str(user["_id"])  # Convertir l'ObjectId en une chaîne pour la réponse JSON
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")

