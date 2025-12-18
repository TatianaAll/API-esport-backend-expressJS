const Scores = require("../models/NotationModel");

// Get all scores
exports.getAllScores = (req, res, next) => {
  Scores.find()
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error })); // find() to get all documents in the collection
};
// Get all scores in a tournament
exports.getScoresInTournament = (req, res, next) => {
  Scores.find({ tournament: req.params.tournament_id })
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};
// Get scores for a specific team in a tournament
exports.getScoresForTeamInTournament = (req, res, next) => {
  Scores.find({
    tournament: req.params.tournament_id,
    team: req.params.team_id,
  })
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};
// Get scores for a specific player in a tournament
exports.getScoresForPlayerInTournament = (req, res, next) => {
  Scores.find({ tournament: req.tournament_id, player: req.params.player_id })
    .then((scores) => res.status(200).json(scores))
    .catch((error) => res.status(400).json({ error }));
};

// CREATE
exports.createScore = (req, res, next) => {
  const newScore = new Scores ({
    ...req.body, //read the body
  });
  if (req.auth && req.auth.role_id.includes("jury")) {
    newScore
      .save() //save in DB
      .then(() => {
        res.status(201).json({ message: "Nouveau score enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      }); 
  } else {
    res.status(403).json({ message: "Accès refusé : rôle de jury requis." });
  }
};

// Update
exports.updateScore = (req, res, next) => {
  // 1st check if the user has the "jury" role
  if (!(req.auth && req.auth.role_id.includes("jury"))) {
    return res.status(403).json({ message: "Accès refusé : rôle de jury requis." });
  }

  const id = req.params.id;
  const updates = req.body || {};

  Scores.findById(id)
    .then(score => {
      // 2nd check if the authenticated user is the jury who created the score
      if (req.auth.userId !== score.jury.toString()) {
        return res.status(403).json({ message: "Accès refusé : vous n'êtes pas le jury ayant créé ce score." });
      }
      Scores.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
      .then(updated => {
        if (!updated) return res.status(404).json({ message: 'Score non trouvé' });
        res.status(200).json(updated);
      })
      .catch(error => res.status(400).json({ error }));
  })
};

// DELETE
exports.deleteScore = (req, res, next) => {
  // 1st check if the user has the "jury" role
  if (!(req.auth && req.auth.role_id.includes("jury"))) {
    return res.status(403).json({ message: "Accès refusé : rôle de jury requis." });
  }

  const id = req.params.id;

  Scores.findById(id)
    .then(score => {
      // 2nd check if the authenticated user is the jury who created the score
      if (req.auth.userId !== score.jury.toString()) {
        return res.status(403).json({ message: "Accès refusé : vous n'êtes pas le jury ayant créé ce score." });
      }
      Scores.deleteOne({ _id: id })
        .then(() => res.status(200).json({ message: "Score supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
};