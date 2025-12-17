const Teams = require("../models/TeamModel"); // on appelle le modèle

// Ajout d'un jeu
exports.createTeam = (req, res, next) => {
  const newTeam = new Teams({
    ...req.body, //on décompose le body
  });
  newTeam
    .save() //on enregistre dans la BDD
    .then(() => {
      res.status(201).json({ message: "Nouvelle équipe enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllTeams = (req, res, next) => {
  Teams.find()
    .then((foundedTeams) => res.status(200).json(foundedTeams))
    .catch((error) => res.status(400).json({ error })); // on utilise la méthode find de mongoose pour récupérer tous les logements
};

exports.getTeamsById = (req, res, next) => {
  Teams.findOne({ _id: req.params.id })
    .then((foundedTeams) => res.status(200).json(foundedTeams))
    .catch((error) => res.status(404).json({ error })); // on utilise la méthode findOne de mongoose pour récupérer un seul logement en fonction de son id;
};

exports.updateTeams = (req, res, next) => {
  const id = req.params.id;
  const updates = req.body || {};

  Teams.findByIdAndUpdate(id, updates, {
    new: true,           // retourne le document mis à jour
    runValidators: true, // applique les validators du schéma
    useFindAndModify: false
  })
    .then(updated => {
      if (!updated) return res.status(404).json({ message: 'Equipe non trouvée' });
      res.status(200).json(updated);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteTeamsById = (req, res, next) => {
  Teams.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Jeu supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
