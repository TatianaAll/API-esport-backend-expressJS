const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const TeamsController = require("../controller/TeamsController");

router.get("/", TeamsController.getAllTeams);
router.get("/:id", TeamsController.getTeamsById);
router.post("/", TeamsController.createTeam);
router.delete("/:id", TeamsController.deleteTeamsById);
router.patch("/:id", TeamsController.updateTeams);

module.exports = router;