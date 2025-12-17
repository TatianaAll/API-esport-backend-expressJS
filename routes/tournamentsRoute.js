const express = require("express");
const router = express.Router();
const TournamentsController = require("../controller/TournamentsController");
const auth = require("./../middlewares/auth.js");

router.get("/", TournamentsController.getAllTournaments);
router.get("/:tournament_id", TournamentsController.getTournamentById);
router.post("/", TournamentsController.createTournament);
router.patch("/:tournament_id", auth, TournamentsController.updateTournament);
router.put("/:tournament_id", auth, TournamentsController.updateTournament);
router.delete("/:tournament_id", auth, TournamentsController.deleteTournament);
// /tournaments/{id}/teams
// /tournaments/{id}/rewards
// /tournaments/{id}/players
// /tournaments/{id}/jury

module.exports = router;