const express = require('express');
const process = require('process');

// Import the monngoose package to the connection at MongoDB
const mongoose = require('mongoose');

const app = express();

let uri = process.env.DB_CONNECTION;
if (typeof uri === 'string' && uri.startsWith('"') && uri.endsWith('"')) {
  uri = uri.slice(1, -1);
}

if (!uri) {
  console.error("DB_CONNECTION n'existe pas, vérifier le .env");
} else {
  const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
  mongoose
    .connect(uri, clientOptions)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.error('Erreur connexion MongoDB :', err));

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
}

// Precision that Express use JSON for requests
app.use(express.json());

// Add CORS to allow requests from different origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Everyone can access
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  ); // Autorisation de certains en-têtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // allow HTTP methods

  // allow if option
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Redirection thanks to the routes files
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

const scoresRoutes = require('./routes/scoresRoute');
app.use('/scores', scoresRoutes);

const adminsRoutes = require('./routes/adminsRoute');
app.use('/admin', adminsRoutes);

module.exports = app;
