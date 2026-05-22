const Teams = require("../models/TeamModel"); // on appelle le modèle
const JoinRequest = require("../models/JoinRequestModel");
const { sendEmail } = require("../middleware/emailService");

// CREATE
// Create new team
exports.createTeam = (req, res, next) => {
  const userId = req.auth.userId; // current user

  const newTeam = new Teams({
    name: req.body.name,
    favorite_game: req.body.favorite_game,
    nationality: req.body.nationality,
    // adding the creator as member and manager of the team
    managers: [userId],
    teammates: [userId],
  });

  newTeam
    .save()
    .then(() => {
      res.status(201).json({ message: "Nouvelle équipe enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ message: "Erreur création équipe" });
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
  const userId = req.auth.userId;
  const teamId = req.params.id;

  Teams.findOne({ _id: req.params.id })
    .populate("managers")
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Équipe non trouvée" });
      }
      // if the same user already have join the team => error 409 Conflict
      if (team.teammates.some((id) => id.toString() === userId)) {
        return res.status(409).json({
          message: "Vous êtes déjà membre de cette équipe",
        });
      }

      // check if a joining request already exist for this user
      JoinRequest.findOne({
        user: userId,
        team: teamId,
        status: "pending",
      })
        .then((request) => {
          if (request) {
            return res.status(409).json({
              message: "Une demande est déjà en cours pour cette équipe",
            });
          }
          // create the resquest
          JoinRequest.create({
            user: userId,
            team: teamId,
          });

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
    });
};

exports.getAllJoiningRequests = (req, res, next) => {
  const teamId = req.params.id;
  const userId = req.auth.userId; // need to check the user

  // Check if the team exist && the user is manager
  Teams.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Team non trouvée" });
      }

      const isManager = team.managers.some(
        (managerId) => managerId.toString() === userId,
      );

      if (!isManager) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      // Return the requests
      return JoinRequest.find({
        status: "pending",
        team: teamId,
      }).populate("user", "firstname lastname email");
    })
    .then((pendingRequests) => {
      if (pendingRequests) {
        res.status(200).json(pendingRequests);
      }
    })
    .catch(() => {
      res.status(400).json({ message: "Erreur récupération" });
    });
};

// TO DO TO COMPLETE : SEND E-MAIL TO THE USER
exports.acceptJoiningRequest = (req, res, next) => {
  const teamId = req.params.id;
  const requestId = req.params.requestId;
  const userId = req.auth.userId;

  // check if the user is manager in the team
  Teams.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Team non trouvée" });
      }

      const isManager = team.managers.some(
        (managerId) => managerId.toString() === userId,
      );

      if (!isManager) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      // get the joining request
      return JoinRequest.findById(requestId);
    })
    // Get the request and update status
    .then((request) => {
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" });
      }
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Demande déjà traitée" });
      }
      // update status
      request.status = "accepted";
      return request.save();
    })
    // adding to the team
    .then((updatedRequest) => {
      if (!updatedRequest) return;

      return Teams.findByIdAndUpdate(
        teamId,
        { $addToSet: { teammates: updatedRequest.user } },
        { new: true },
        // $addToSet is a Mongo function => https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
      );
    })
    .then(() => {
      res.status(200).json({ message: "Demande acceptée" });
    })
    .catch(() => {
      res.status(400).json({ message: "Erreur traitement demande" });
    });
};

exports.rejectJoiningRequest = (req, res, next) => {
  const teamId = req.params.id;
  const requestId = req.params.requestId;
  const userId = req.auth.userId;

  // check manager role
  Teams.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: "Team non trouvée" });
      }

      const isManager = team.managers.some(
        (managerId) => managerId.toString() === userId,
      );

      if (!isManager) {
        return res.status(403).json({ message: "Accès refusé" });
      }

      // get the request and be sure that it is still pending
      return JoinRequest.findById(requestId);
    })
    .then((request) => {
      if (!request) {
        return res.status(404).json({ message: "Demande non trouvée" });
      }

      if (request.status !== "pending") {
        return res.status(400).json({ message: "Demande déjà traitée" });
      }

      // Reject request
      request.status = "rejected";

      return request.save();
    })
    .then(() => {
      res.status(200).json({ message: "Demande refusée" });
    })
    .catch(() => {
      res.status(400).json({ message: "Erreur lors du refus" });
    });
};
