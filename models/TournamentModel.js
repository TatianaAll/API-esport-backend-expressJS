const mongoose = require("mongoose");

const tournamentSchema = mongoose.Schema({
  name: { type: String, required: true },
  place_name: { type: String, required: true },
  capacity: { type: Object, required: true },
  equipment: { type: [String] },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: String, required: true },
  specialized_game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Games", // la référence au modèle Games
    required: true,
  },
  registred_teams: [{type: mongoose.Schema.Types.ObjectId,
    ref: "Teams",
    required: true
  }]
});

module.exports = mongoose.model("Tournaments", tournamentSchema);
