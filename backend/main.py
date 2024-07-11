from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routers import cars, users, reservations
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Autoriser les origines spécifiques pour les requêtes CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Adresse de votre application ReactJS
]

# Ajouter le middleware CORS à votre application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Inclure les routes des différents routeurs
app.include_router(cars.router)
app.include_router(users.router)
app.include_router(reservations.router)

# Montage du dossier d'images pour être servi par FastAPI
app.mount("/img", StaticFiles(directory="img"), name="img")

# Montage du dossier 'app' pour les fichiers statiques
app.mount("/static", StaticFiles(directory="app"), name="static")

# Affiche la page index à la racine de l'application
@app.get("/", tags=["Index"])
async def read_index():
    return FileResponse("app/index.html")
