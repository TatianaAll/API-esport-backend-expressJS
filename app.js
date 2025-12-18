
const express = require("express");

// on importe le paquet mongoose pour se connecter à la base de données MongoDB
const mongoose = require("mongoose");

const app = express();

let uri = process.env.DB_CONNECTION;
if (typeof uri === "string" && uri.startsWith('"') && uri.endsWith('"')) {
  uri = uri.slice(1, -1);
}

if (!uri) {
  console.error("DB_CONNECTION is not set. Check backend/.env");
} else {
  const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
  mongoose
    .connect(uri, clientOptions)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.error("Erreur connexion MongoDB :", err));

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });
}

// on précise l'utilisation de express et donc du JSON pour les requetes
app.use(express.json());

// Ajout du CORS pour autoriser les requêtes entre origines différentes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // tout le monde peut y accéder
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Autorisation de certains en-têtes
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // autorisation des méthodes HTTP
  next();
});

//On doit appeler les routers vers les différents controllers
const gamesRoutes = require('./routes/gamesRoute');
app.use('/games', gamesRoutes);

const tournamentsRoutes = require('./routes/tournamentsRoute');
app.use('/tournaments', tournamentsRoutes);

const usersRoutes = require('./routes/usersRoute');
app.use('/users', usersRoutes);

const teamsRoutes = require('./routes/teamsRoute');
app.use('/teams', teamsRoutes);

const rewardsRoutes = require('./routes/rewardsRoute');
app.use('/rewards', rewardsRoutes);


module.exports = app;
