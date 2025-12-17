const Tournaments = require("../models/TournamentModel"); // on appelle le modèle

// CREATE
// Création d'un nouveau tournoi
exports.createTournament = (req, res, next) => {
  const tournament = new Tournaments({
    ...req.body, //on décompose le body
  });
  tournament
    .save() //on enregistre dans la BDD
    .then(() => {
      res.status(201).json({ message: "Ajout du tournoi enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// READ
// Voir tous les tournois organisés
exports.getAllTournaments = (req, res, next) => {
  Tournaments.find()
    .then((tournaments) => res.status(200).json(tournaments))
    .catch((error) => res.status(400).json({ error })); // on utilise la méthode find de mongoose pour récupérer tous les logements
};
// Voir 1 tournois selon son id
exports.getTournamentById = (req, res, next) => {
  Tournaments.findOne({ _id: req.params.tournament_id })
    .then((tournaments) => res.status(200).json(tournaments))
    .catch((error) => res.status(404).json({ error })); // on utilise la méthode findOne de mongoose pour récupérer un seul logement en fonction de son id;
};

// UPDATE
exports.updateTournament = (req, res, next) => {
  const id = req.params.tournament_id;
  const updates = req.body || {};

  Tournaments.findByIdAndUpdate(id, updates, {
    new: true, // retourne le document mis à jour
    runValidators: true, // applique les validators du schéma
    useFindAndModify: false,
  })
    .then((updated) => {
      if (!updated)
        return res.status(404).json({ message: "Tournoi non trouvé" });
      res.status(200).json(updated);
    })
    .catch((error) => res.status(400).json({ error }));
};

// DELETE
exports.deleteTournament = (req, res, next) => {
  Tournaments.deleteOne({ _id: req.params.tournament_id })
    .then(() => res.status(200).json({ message: "Tournoi supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
