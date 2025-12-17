const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const GameController = require("../controller/GameController");


router.get("/", GameController.getAllGames);
router.get("/:id_games", GameController.getGameById);
router.post("/", auth, GameController.createGame);
router.delete("/:id_games", auth, GameController.deleteGameById);
router.patch("/:id_games", auth, GameController.updateGame);
router.get("/:name", GameController.getGameByName);

module.exports = router;