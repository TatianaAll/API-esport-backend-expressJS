const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const ScoresController = require("../controller/ScoresController");

// Classic CRUD routes
router.get("/", ScoresController.getAllScores);
// router.post("/", auth, ScoresController.createScore);
router.patch("/:id", auth, ScoresController.updateScore);
// Get all scores in a tournament
router.get("/tournaments/:tournament_id", ScoresController.getScoresInTournament);
router.get("/tournaments/:tournament_id/teams/:team_id", ScoresController.getScoresForTeamInTournament);
router.get("/tournaments/:tournament_id/players/:player_id", ScoresController.getScoresForPlayerInTournament);

module.exports = router;