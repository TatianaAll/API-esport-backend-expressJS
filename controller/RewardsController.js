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

// Get all rewards for a specific team in a tournament
exports.getRewardsInTeam = (req, res, next) => {
  Rewards.find({
    tournament: req.params.tournament_id,
    team: req.params.team_id,
  })
    .then((rewards) => res.status(200).json(rewards))
    .catch((error) => res.status(400).json({ error }));
};

// Get all rewards for a specific team
exports.getRewardsInTeam = (req, res, next) => {
  Rewards.find({ team: req.params.id })
    .then((rewards) => res.status(200).json(rewards))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteRewardById = (req, res, next) => {
  Rewards.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Récompense supprimée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.updateReward = (req, res, next) => {
  const id = req.params.id;
  const updates = { ...(req.body || {}) };

  // Control: only an admin can update a reward
  if (!req.auth || req.auth.user_role.includes("admin")) {
    return res.status(403).json({ message: "Non autorisé" });
  }
  // update the reward
  Rewards.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
    .then((updated) => {
      if (!updated)
        return res.status(404).json({ message: "Récompense non trouvée" });
      res.status(200).json(updated);
    })
    .catch((error) => res.status(400).json({ error }));
};
