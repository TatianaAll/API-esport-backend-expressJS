const Scores = require("../models/NotationModel");
const Tournaments = require("../models/TournamentModel");

// Get all scores
exports.getAllScores = (req, res, next) => {
  Scores.find()
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error })); // find() to get all documents in the collection
};
// Get all scores in a tournament
exports.getScoresInTournament = (req, res, next) => {
  Scores.find({ tournament_id: req.params.tournament_id })
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};
// Get scores for a specific team in a tournament
exports.getScoresForTeamInTournament = (req, res, next) => {
  Scores.find({
    tournament_id: req.params.tournament_id,
    team_id: req.params.team_id,
  })
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};
// Get scores for a specific player in a tournament
exports.getScoresForPlayerInTournament = (req, res, next) => {
  Scores.find({
    tournament_id: req.tournament_id,
    player_id: req.params.player_id,
  })
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};

// CREATE
exports.createScore = (req, res, next) => {
  // Check the role of the authenticated user
  if (!req.auth || !req.auth.role.includes("jury")) {
    return res
      .status(403)
      .json({ message: "Accès refusé : rôle de jury requis." });
  }

  // Check the existence of the tournament
  Tournaments.findOne({ _id: req.params.tournament_id })
    .then((tournament) => {
      if (!tournament) {
        return res.status(404).json({ message: "Tournoi introuvable." });
      }

      // Create the new score
      const newScore = new Scores({
        ...req.body,
        jury_id: req.auth.userId,
        player_id: req.params.player_id,
        team_id: req.params.team_id,
        tournament_id: req.params.tournament_id,
        game_id: tournament.game_id, // the tournament has a game_id field
        total_score: Object.values(req.body.criteria).reduce(
          (sum, value) => sum + value,
          0
        ),
      });

      // Save the new score
      newScore
        .save()
        .then(() =>
          res.status(201).json({ message: "Nouveau score enregistré !" })
        )
        .catch((error) => res.status(400).json({ error: error.message }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// Update
exports.updateScore = (req, res, next) => {
  // First, check the role of the authenticated user
  if (!req.auth || !req.auth.role.includes("jury")) {
    return res
      .status(403)
      .json({ message: "Accès refusé : rôle de jury requis." });
  }

  const id = req.params.id;

  // Get the existing score
  Scores.findById(id)
    .then((score) => {
      if (!score) return res.status(404).json({ message: "Score non trouvé" });
      // Check if the authenticated user is the jury who created the score
      if (req.auth.userId !== score.jury_id.toString()) {
        return res
          .status(403)
          .json({
            message:
              "Accès refusé : vous n'êtes pas le jury ayant créé ce score.",
          });
      }

      // Update the fields one by one
      if (req.body.criteria) score.criteria = req.body.criteria;
      if (req.body.comment) score.comment = req.body.comment;
      if (req.body.notation_date) score.notation_date = req.body.notation_date;
      if (req.body.team_id) score.team_id = req.body.team_id;
      if (req.body.player_id) score.player_id = req.body.player_id;

      // Recalculate total_score if criteria changed
      if (req.body.criteria) {
        score.total_score = Object.values(req.body.criteria).reduce(
          (sum, val) => sum + val,
          0
        );
      }

      // Save the updated score
      return score.save();
    })
    .then((updatedScore) => res.status(200).json(updatedScore))
    .catch((error) => res.status(400).json({ error: error.message }));
};
