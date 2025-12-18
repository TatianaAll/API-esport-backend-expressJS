const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  name: { type: String, required: true },
  release_date: { type: Date },
  genres: {
    type: [String],
    required: true,
  },
  platforms: { type: [String], required: true },
  publisher: {
    type: String,
    required: true,
  },
  max_player: { type: Number, required: true },
});

module.exports = mongoose.model("Games", gameSchema);
