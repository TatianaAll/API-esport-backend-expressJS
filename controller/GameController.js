const { use } = require("react");
const Games = require("../models/GameModel"); // on appelle le modèle

// Ajout d'un jeu
exports.createGame = (req, res, next) => {
  const game = new Games({
    ...req.body, //on décompose le body
  });
  game
    .save() //on enregistre dans la BDD
    .then(() => {
      res.status(201).json({ message: "Ajout du jeu enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllGames = (req, res, next) => {
  Games.find()
    .then((games) => res.status(200).json(games))
    .catch((error) => res.status(400).json({ error })); // on utilise la méthode find de mongoose pour récupérer tous les logements
};

exports.getGameById = (req, res, next) => {
  Games.findOne({ _id: req.params.id_games })
    .then((games) => res.status(200).json(games))
    .catch((error) => res.status(404).json({ error })); // on utilise la méthode findOne de mongoose pour récupérer un seul logement en fonction de son id;
};

exports.updateGame = (req, res, next) => {
  const id = req.params.id;
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

exports.deleteGameById = (req, res, next) => {
  Games.deleteOne({ _id: req.params.id_games })
    .then(() => res.status(200).json({ message: "Jeu supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
