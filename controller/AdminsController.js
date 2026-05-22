const Users = require('../models/UsersModel'); // on appelle le modèle
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// Update the roles for a user
exports.updateRoles = (req, res) => {
  console.log('controller Admin');
  const id = req.params.id;

  // Control: only admins can updates the roles
  if (!req.auth || !req.auth.role.includes('admin')) {
    return res.status(403).json({ message: 'Non autorisé' });
  }

  const role = req.body.role;
  // Check if a role is passed
  if (!role) {
    return res.status(400).json({ message: 'Rôle manquant' });
  }

  // Format of role need to be an array
  const roles = Array.isArray(role) ? role : [role];

  // whitelist of roles and check the validity
  const allowedRoles = ['user', 'jury', 'admin'];
  // The every() method of Array instances returns false if it finds an element in the array that does not satisfy the provided testing function. Otherwise, it returns true.
  const isValid = roles.every((r) => allowedRoles.includes(r));
  if (!isValid) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }

  // An admin cannot unadmin himself
  if (req.auth.userId === id && !roles.includes('admin')) {
    return res.status(400).json({
      message: 'Vous ne pouvez pas vous retirer vous-même votre rôle admin',
    });
  }

  Users.findByIdAndUpdate(id, { role: roles }, { new: true, runValidators: true })
    .then((rolesUpdated) => {
      if (!rolesUpdated) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      res.status(200).json(rolesUpdated);
    })
    .catch(() => res.status(400).json({ message: 'Erreur lors de la mise à jour des rôles' }));
};
