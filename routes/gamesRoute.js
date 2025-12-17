const express = require("express");
const router = express.Router();
const GameController = require("../controller/GameController");

router.get("/", GameController.getAllGames);
router.get("/:id_games", GameController.getGameById);
router.post("/", GameController.createGame);
router.delete("/:id_games", GameController.deleteGameById);
router.patch("/:id_games", GameController.updateGame);

module.exports = router;