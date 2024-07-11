# Utiliser une image de base pour Node.js
FROM node:14-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le reste des fichiers de l'application
COPY . .

# Installer les dépendances
RUN npm install

# Exposer le port du serveur
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["./node_modules/.bin/react-scripts", "start"]
