const Users = require('../models/UsersModel'); // on appelle le modèle
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const process = require('process');

// CREATE
// Create new user for register (signup)
exports.signupNewUser = async (req, res) => {
  try {
    // Check if the email already exist in DB
    const existingUser = await Users.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hash password
    const hash = await bcrypt.hash(req.body.password, 10);

    // Création utilisateur
    const user = new Users({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hash,
      favorite_game: req.body.favorite_game,
      team_role: req.body.team_role,
      year_joining_team: req.body.year_joining_team,
      nationality: req.body.nationality,
      specialty: req.body.specialty,
      team_id: req.body.team_id,
      /* avatar: req.file ? req.file.path : undefined, // multer avatar upload */
    });

    await user.save();

    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ message: `Erreur lors de la création ${error}` });
  }
};

// READ
// Connexion
exports.loginUser = (req, res) => {
  Users.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
                  expiresIn: '24h',
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// get one user by id
exports.getOneUserById = (req, res) => {
  Users.findOne({ _id: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllUsers = (req, res) => {
  Users.find()
    .then((allUsers) => res.status(200).json(allUsers))
    .catch((error) => res.status(400).json({ error }));
};

// UPDATE (PUT/PATCH) — only by the user himself
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const updates = { ...(req.body || {}) };

  // Control: only the user can update his profile
  if (!req.auth || req.auth.userId !== id) {
    return res.status(403).json({ message: 'Non autorisé' });
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
        if (!updated) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(updated);
      })
      .catch((error) => res.status(400).json({ error }));
  }

  Users.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    .then((updated) => {
      if (!updated) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      res.status(200).json(updated);
    })
    .catch((error) => res.status(400).json({ error }));
};

// DELETE user (protected))
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  // Control: only the user can delete his profile
  if (!req.auth || req.auth.userId !== id) {
    return res.status(403).json({ message: 'Non autorisé' });
  }

  Users.deleteOne({ _id: id })
    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch((error) => res.status(400).json({ error }));
};
