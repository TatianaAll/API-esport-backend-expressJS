const Tournaments = require("../models/TournamentModel"); // on appelle le modèle

// CREATE
// Create new tournament
exports.createTournament = (req, res, next) => {
  const tournament = new Tournaments({
    ...req.body, //read the body
  });
  // Checking of the logic of dates
  if (req.body.start_date >= req.body.end_date) {
    return res.status(400).json({
      message: "La date de début doit être antérieure à la date de fin.",
    });
  }
  if (new Date(req.body.start_date) < new Date()) {
    return res
      .status(400)
      .json({ message: "La date de début doit être dans le futur." });
  }

  // Check the validity of juries members
  if (req.body.jury && req.body.jury.length > 0) {
    Users.find({ _id: { $in: req.body.jury } })
      .then((users) => {
        const invalidJury = users.find((user) => !user.role.includes("jury"));

        if (invalidJury) {
          return res.status(400).json({
            message: `L'utilisateur ${invalidJury._id} n'a pas le rôle jury`,
          });
        }

        // Green flags only ==> save
        tournament
          .save()
          .then(() => {
            res.status(201).json({ message: "Ajout du tournoi enregistré !" });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    // No jury provided ==> save directly
    tournament
      .save()
      .then(() => {
        res.status(201).json({ message: "Ajout du tournoi enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
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

exports.getPlayersInTeam = (req, res, next) => {
  Tournaments.findOne({ _id: req.params.tournament_id }) // find the tournament
    .populate({
      path: "registered_teams.team", // populate the team field in registered_teams
      populate: { path: "teammates" },
    })
    .then((tournament) => {
      if (!tournament) {
        return res.status(404).json({ message: "Tournoi non trouvé" });
      }

      // Search the team in the registered_teams array
      const entry = tournament.registered_teams.find(
        (registredTeamFound) =>
          registredTeamFound.team._id.toString() === req.params.team_id
      ); // team_id from the URL params

      if (!entry) {
        // If the team is not found
        return res
          .status(404)
          .json({ message: "Équipe non trouvée dans ce tournoi" });
      }

      // Return the teammates of the found team
      res.status(200).json(entry.team.teammates);
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

// UPDATE
exports.updateTournament = (req, res, next) => {
  // Check dates ONLY if modified
  if (req.body.start_date && req.body.end_date) {
    if (req.body.start_date >= req.body.end_date) {
      return res.status(400).json({
        message: "La date de début doit être antérieure à la date de fin.",
      });
    }
  }

  if (req.body.start_date) {
    if (new Date(req.body.start_date) < new Date()) {
      return res.status(400).json({
        message: "La date de début doit être dans le futur.",
      });
    }
  }

  // Check jury if modified
  if (req.body.jury && req.body.jury.length > 0) {
    Users.find({ _id: { $in: req.body.jury } })
      .then((users) => {
        const invalidJury = users.find((user) => !user.role.includes("jury"));

        if (invalidJury) {
          return res.status(400).json({
            message: `L'utilisateur ${invalidJury._id} n'a pas le rôle jury`,
          });
        }

        // OK → update
        Tournaments.updateOne({ _id: req.params.id }, { ...req.body })
          .then(() => {
            res.status(200).json({ message: "Tournoi mis à jour !" });
          })
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    // No jury provided or empty ==> update directly
    Tournaments.updateOne({ _id: req.params.id }, { ...req.body })
      .then(() => {
        res.status(200).json({ message: "Tournoi mis à jour !" });
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

// DELETE
exports.deleteTournament = (req, res, next) => {
  Tournaments.deleteOne({ _id: req.params.tournament_id })
    .then(() => res.status(200).json({ message: "Tournoi supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
