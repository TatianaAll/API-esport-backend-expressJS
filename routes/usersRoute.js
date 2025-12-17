const express = require("express");
const router = express.Router();
const UsersController = require("../controller/UsersController");

router.post("/signup", UsersController.signupNewUser);
router.post("/login", UsersController.loginUser);

module.exports = router;