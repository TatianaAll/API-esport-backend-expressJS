const Users = require("../models/UsersModel"); // on appelle le modèle
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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
        res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: "Paire login/mot de passe incorrecte" });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};