const mongoose = require("mongoose");

const rewardSchema = mongoose.Schema({
  name: { type: String, required: true },
  tournament_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournaments", // la référence au modèle Tournaments
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teams", // la référence au modèle Teams
  },
  reward: {
    type: String,
  },
  estimated_value: { type: Number },
});

module.exports = mongoose.model("Rewards", rewardSchema);
