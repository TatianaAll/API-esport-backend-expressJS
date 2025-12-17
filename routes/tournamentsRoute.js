const express = require("express");
const router = express.Router();
const TournamentsController = require("../controller/TournamentsController");

router.get("/", TournamentsController.getAllTournaments);
router.get("/:tournament_id", TournamentsController.getTournamentById);
router.post("/", TournamentsController.createTournament);
router.patch("/:tournament_id", TournamentsController.updateTournament);
router.put("/:tournament_id", TournamentsController.updateTournament);
router.delete("/:tournament_id", TournamentsController.deleteTournament);
// /tournaments/{id}/teams
// /tournaments/{id}/rewards
// /tournaments/{id}/players
// /tournaments/{id}/jury

module.exports = router;