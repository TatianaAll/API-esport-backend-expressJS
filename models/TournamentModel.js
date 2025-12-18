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
  registered_teams: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams",
        required: true,
      },
      inscription_date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  registred_juries: [
    {
      jury: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      inscription_date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ]
});

module.exports = mongoose.model("Tournaments", tournamentSchema);
