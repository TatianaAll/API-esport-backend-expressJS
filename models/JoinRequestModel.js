const mongoose = require("mongoose");

const JoinRequestSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teams",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "refused"],
    default: "pending"
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date,
    require: false
  }
});

module.exports = mongoose.model("JoinRequests", JoinRequestSchema);