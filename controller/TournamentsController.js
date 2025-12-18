const Tournaments = require("../models/TournamentModel"); // on appelle le modèle

// CREATE
// Create new tournament
exports.createTournament = (req, res, next) => {
  const tournament = new Tournaments({
    ...req.body, //read the body
  });
  tournament
    .save() // save in DB
    .then(() => {
      res.status(201).json({ message: "Ajout du tournoi enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// READ
// All tournaments
exports.getAllTournaments = (req, res, next) => {
  Tournaments.find()
    .then((tournaments) => res.status(200).json(tournaments))
    .catch((error) => res.status(400).json({ error })); // find() to get all documents in the collection
};
// See a specific tournament by id
exports.getTournamentById = (req, res, next) => {
  Tournaments.findOne({ _id: req.params.tournament_id })
    .then((tournaments) => res.status(200).json(tournaments))
    .catch((error) => res.status(404).json({ error })); // findOne() to get a specific document with the id
};

// Get all the teams registrered in a specific tournament
exports.getTeamsInTournament = (req, res, next) => {
  Tournaments.findOne({ _id: req.params.tournament_id })
    .populate("registred_teams") // field name in TournamentModel
    .then((tournament) => {
      if (!tournament) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
      }
      res.status(200).json(tournament.registred_teams);
    })
    .catch((error) => res.status(400).json({ error }));
};

// UPDATE
exports.updateTournament = (req, res, next) => {
  const id = req.params.tournament_id;
  const updates = req.body || {};

  Tournaments.findByIdAndUpdate(id, updates, {
    new: true, // return the modified document
    runValidators: true, // apply the validators of the schema
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
