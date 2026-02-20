const Users = require("../models/UsersModel"); // on appelle le modèle
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE
// Create new user for register (signup)
exports.signupNewUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        role: ["spectator"],
        password: hash,
        favorite_game: req.body.favorite_game,
        team_role: req.body.team_role,
        year_joining_team: req.body.year_joining_team,
        nationality: req.body.nationality,
        specialty: req.body.specialty,
        team_id: req.body.team_id,
        /* avatar: req.file ? req.file.path : undefined, // multer avatar upload */
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// READ
// Connexion
exports.loginUser = (req, res, next) => {
  Users.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: "Paire login/mot de passe incorrecte" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id, role: user.role },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "24h",
                  }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// get one user by id
exports.getOneUserById = (req, res, next) => {
  Users.findOne({ _id: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllUsers = (req, res, next) => {
  Users.find()
    .then((allUsers) => res.status(200).json(allUsers))
    .catch((error) => res.status(400).json({ error }));
}

// UPDATE (PUT/PATCH) — only by the user himself
exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const updates = { ...(req.body || {}) };

  // Control: only the user can update his profile
  if (!req.auth || req.auth.userId !== id) {
    return res.status(403).json({ message: "Non autorisé" });
  }
  // Handle avatar upload
  if (req.file) {
    req.body.avatar = req.file.path;
  }

  // For the password we need to hash it again
  if (updates.password) {
    const plain = updates.password;
    return bcrypt
      .hash(plain, 10)
      .then((hash) => {
        updates.password = hash;
        return Users.findByIdAndUpdate(id, updates, {
          new: true,
          runValidators: true,
        });
      })
      .then((updated) => {
        if (!updated)
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(updated);
      })
      .catch((error) => res.status(400).json({ error }));
  }

  Users.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    .then((updated) => {
      if (!updated)
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      res.status(200).json(updated);
    })
    .catch((error) => res.status(400).json({ error }));
};

// DELETE user (protected))
exports.deleteUser = (req, res, next) => {
  const id = req.params.id;
  
  // Control: only the user can delete his profile
  if (!req.auth || req.auth.userId !== id) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  Users.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
