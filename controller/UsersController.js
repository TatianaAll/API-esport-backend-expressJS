const Users = require("../models/UsersModel"); // on appelle le modèle
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// CREATE
// Création d'un nouvel utilisateur
exports.signupNewUser = (req, res, next) => {
  // gestion du cryptage du password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new Users({
        ...req.body, //on décompose le body
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        role: req.body.role, // ou status selon ton modèle
        password: hash,
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
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// UPDATE (PUT/PATCH) — seul le user peut modifier son profil
exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const updates = { ...(req.body || {}) };

  // contrôle d'autorisation : le user peux modif son profil (uniquement)
  if (!req.auth || req.auth.userId !== id) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  // Si on veut permettre la mise à jour du mot de passe : le hasher d'abord
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

// DELETE user (protégé)
exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  // Contrôle d'autorisation basique (seul le user peut se supprimer — adapter pour admin)
  if (!req.auth || req.auth.userId !== id) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  Users.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
