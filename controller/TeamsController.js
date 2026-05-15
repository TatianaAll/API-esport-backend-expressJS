const Teams = require("../models/TeamModel"); // on appelle le modèle
const { sendEmail } = require("../middleware/emailService");

// CREATE
// Create new team
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

exports.searchInTeams = (req, res, next) => {
  // We need the query from the frontend
  const { query } = req.query;
  // if we didn't have a query ==> error
  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }
  // research with the special caracter $ in mongoDB
  Teams.find({ name: { $regex: query } })
    .then((teams) => {
      res.status(200).json(teams);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
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

// Asking to join a preexisting team
exports.requestToJoin = (req, res, next) => {
  // need the user wh's asking to join the team
  const userId = req.user.id;

  Teams.findOne({ _id: req.params.id })
    .populate("managers")
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Équipe non trouvée" });
      }
      // if the same user already have join the team => error 409 Conflict
      if (team.teammates.includes(userId)) {
        return res
          .status(409)
          .json({
            message: "Vous êtes déjà membre de cette équipe"
          });
      }

      const subject = "Nouvelle demande pour votre équipe";
      // message to complete later
      const message = `${userId} souhaite rejoindre votre équipe ${team.name}`;

      team.managers.forEach((manager) => {
        sendEmail(manager.email, subject, message).catch((err) =>
          console.log("Erreur email:", err),
        );
      });

      res.status(200).json({
        message: "Demande envoyée aux managers",
      });
    })
    .catch((error) => res.status(400).json({ error }));
};
