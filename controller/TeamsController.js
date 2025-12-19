const Teams = require("../models/TeamModel"); // on appelle le modèle

// CREATE
// Create new game
exports.createTeam = (req, res, next) => {
  const newTeam = new Teams({
    ...req.body, //read the body
  });
  newTeam
    .save() //save in DB
    .then(() => {
      res.status(201).json({ message: "Nouvelle équipe enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// READ
exports.getAllTeams = (req, res, next) => {
  Teams.find()
    .then((foundedTeams) => res.status(200).json(foundedTeams))
    .catch((error) => res.status(400).json({ error })); // find to get all documents in the collection
};
// Get details of a team
exports.getTeamsById = (req, res, next) => {
  Teams.findOne({ _id: req.params.id })
    .populate("teammates")
    .then((foundedTeams) => res.status(200).json(foundedTeams))
    .catch((error) => res.status(404).json({ error })); // ofindOne to get a specific document with the id
};
// get players in a team
exports.getPlayersInTeam = (req, res, next) => {
  Teams.findOne({ _id: req.params.id })
    .populate("teammates") // field name in TeamModel
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Équipe non trouvée" });
      }
      res.status(200).json(team.teammates);
    })
    .catch((error) => res.status(400).json({ error }));
};

// UPDATE
exports.updateTeams = (req, res, next) => {
  const id = req.params.id;
  const updates = req.body || {};

  Teams.findByIdAndUpdate(id, updates, {
    new: true, // update the document and return the updated version
    runValidators: true, // apply schema validators on update
    useFindAndModify: false,
  })
    .then((updated) => {
      if (!updated)
        return res.status(404).json({ message: "Equipe non trouvée" });
      res.status(200).json(updated);
    })
    .catch((error) => res.status(400).json({ error }));
};

// DELETE
exports.deleteTeamsById = (req, res, next) => {
  Teams.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Jeu supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
