const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  role: {
    type: [String],
    enum: ["spectator", "jury", "player", "admin"],
    default: "spectator",
    required: true,
  },
  password: { type: String, required: true },
  favorite_game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Games", // la référence au modèle Games
  },
  team_role: { type: String }, // que pour les joueurs
  year_joining_team: { type: Date }, // que pour les joueurs
  nationality: { type: String },
  specialty: { type: [String] }, // que pour les jurés
  //Ticket_id (référence vers Ticket) pour les spectateurs
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teams",
  },
});

module.exports = mongoose.model("Users", UserSchema);
