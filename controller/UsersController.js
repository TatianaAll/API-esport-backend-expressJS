const Users = require("../models/UsersModel"); // on appelle le modèle
const bcrypt = require("bcrypt");

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
exports.loginUser = (req, res, next) => {};
