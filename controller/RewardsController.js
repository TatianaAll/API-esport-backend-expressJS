const Rewards = require("../models/RewardModel");

// CREATE
exports.createReward = (req, res, next) => {
  // New instance of Reward model
  const newReward = new Rewards({
    ...req.body, // decomposed the body
  });
  newReward
    .save()
    .then(() => {
      res.status(201).json({ message: "Nouveau prix ajouté !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// READ
// Get all rewards
exports.getRewardsInTournament = (req, res, next) => {
  Rewards.find({ tournament: req.params.tournament_id })
    .then((rewards) => res.status(200).json(rewards))
    .catch((error) => res.status(400).json({ error }));
};

