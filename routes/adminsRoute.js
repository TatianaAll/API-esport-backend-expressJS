const express = require("express");
const router = express.Router();
const AdminsController = require("../controller/AdminsController");
const auth = require("../middleware/auth.js");

// route to update the role only available for admins
router.put("/users/:id/roles", auth, AdminsController.updateRoles);

module.exports = router;