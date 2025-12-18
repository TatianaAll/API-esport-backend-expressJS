const express = require("express");
const router = express.Router();
const TournamentsController = require("../controller/TournamentsController");
const auth = require("../middleware/auth.js");

router.get("/", TournamentsController.getAllTournaments);
router.get("/:tournament_id", TournamentsController.getTournamentById);
router.post("/", TournamentsController.createTournament);
router.patch("/:tournament_id", auth, TournamentsController.updateTournament);
router.put("/:tournament_id", auth, TournamentsController.updateTournament);
router.delete("/:tournament_id", auth, TournamentsController.deleteTournament);
// router.get("/:tournament_id/teams", TournamentsController.getTeamsInTournament)
// /tournaments/{id}/rewards
// /tournaments/{id}/players
// /tournaments/{id}/jury
// /tournaments/{id}/teams/{id_team}/players	X	Voir une équipe dans un tournoi
// /tournaments/{id}/teams/{id_team}/players	Yes owner	Ajouter un teammate
// /tournaments/{id}/teams/{id_team}/players		

module.exports = router;