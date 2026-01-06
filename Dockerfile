FROM node:25.1.0-alpine
WORKDIR /app
# Exposition des ports
EXPOSE 3001
# Création des packages dans l'image
COPY package.json ./
COPY package-lock.json ./
# Installation des dépendances
RUN npm install
# Création du dossier
COPY . .
RUN mkdir -p uploads/avatars
# Lancement de la commande pour lancer le server
CMD ["node", "./server.js"]