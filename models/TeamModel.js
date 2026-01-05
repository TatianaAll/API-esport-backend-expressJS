const mongoose = require("mongoose");

const TeamSchema = mongoose.Schema({
  name: { type: String, required: true },
  favorite_game: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Games", // la référence au modèle Games
    },
  ],
  teammates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // la référence au modèle Users
    },
  ],
  creation_date: { type: Date, default: Date.now },
  nationality: { type: String },
});

module.exports = mongoose.model("Teams", TeamSchema);
