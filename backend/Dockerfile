# Utiliser une image de base pour Python
FROM python:3.9-slim

# Assurez-vous que pip est installé
RUN apt-get update && apt-get install -y python3-pip

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires
COPY . .

# Installer les dépendances
RUN pip install -r requirements.txt

# Exposer le port du serveur
EXPOSE 8000

# Commande pour démarrer l'application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
