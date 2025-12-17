const express = require("express");
const router = express.Router();
const UsersController = require("../controller/UsersController");
const auth = require("./../middlewares/auth.js");

router.post("/signup", UsersController.signupNewUser);
router.post("/login", UsersController.loginUser);
router.put("/:id", auth, UsersController.updateUser);
router.patch("/:id", auth, UsersController.updateUser);
router.delete("/:id", auth, UsersController.deleteUser);

module.exports = router;