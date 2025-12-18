const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();
const RewardsController = require("../controller/RewardsController.js");

// Classic CRUD routes
router.post("/", auth, RewardsController.createReward);
// router.delete("/:id", auth, RewardsController.deleteRewardById);
// router.patch("/:id", auth, RewardsController.updateReward);
// router.put("/:id", auth, RewardsController.updateReward);

module.exports = router;