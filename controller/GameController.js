const Games = require("../models/GameModel"); // call the model
const Tournaments = require("../models/TournamentModel"); // call the model Tournaments

// Create game
exports.createGame = (req, res, next) => {
  const game = new Games({
    ...req.body, // decomposed the body
  });
  game
    .save() // save in DB
    .then(() => {
      res.status(201).json({ message: "Ajout du jeu enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// READ
exports.getAllGames = (req, res, next) => {
  Games.find()
    .then((games) => res.status(200).json(games))
    .catch((error) => res.status(400).json({ error })); // method find of mongoose to get all documents in the collection
};

exports.getGameById = (req, res, next) => {
  Games.findOne({ _id: req.params.id_games })
    .then((games) => res.status(200).json(games))
    .catch((error) => res.status(404).json({ error })); // method findOne of mongoose to get one document by id
};

exports.getGameByName = (req, res, next) => {
  Games.findOne({ name: req.params.name })
    .then((games) => res.status(200).json(games))
    .catch((error) => res.status(404).json({ error }));
};

exports.getTournamentsForGame = (req, res, next) => {
  const gameId = req.params.id_games;
  Tournaments.find({ game: gameId })
    .then((tournaments) => res.status(200).json(tournaments))
    .catch((error) => res.status(400).json({ error }));
};

// UPDATE
exports.updateGame = (req, res, next) => {
  const id = req.params.id_games;
  const updates = req.body || {};

  Games.findByIdAndUpdate(id, updates, {
    new: true,           // retourne le document mis à jour
    runValidators: true, // applique les validators du schéma
    useFindAndModify: false
  })
    .then(updated => {
      if (!updated) return res.status(404).json({ message: 'Jeu non trouvé' });
      res.status(200).json(updated);
    })
    .catch(error => res.status(400).json({ error }));
};

// DELETE
exports.deleteGameById = (req, res, next) => {
  Games.deleteOne({ _id: req.params.id_games })
    .then(() => res.status(200).json({ message: "Jeu supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
