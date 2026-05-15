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
    ref: "Games", // ref to the game model
    required: true,
  },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      team: { type: mongoose.Schema.Types.ObjectId, ref: "Teams" },

      role: {
        type: String,
        enum: ["player", "jury", "coach", "staff"],
        required: true,
      },

      inscription_date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Tournaments", tournamentSchema);
