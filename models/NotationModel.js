const mongoose = require("mongoose");

const notationSchema = mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: "Games" },
  jury_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  tournament_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tournaments" },
  criteria: { type: Map, of: Number }, // tableau d’objet de critères notés {“objective”: 5, “teamplay”: 10}
  comment: { type: String },
  total_score: { type: Number },
  notation_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notations", notationSchema);
