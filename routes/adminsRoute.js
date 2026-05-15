const express = require("express");
const router = express.Router();
const UsersController = require("../controller/UsersController");
const auth = require("../middleware/auth.js");

// route to update the role only available for admins
router.put("/users/:id/roles", UsersController.updateRoles);