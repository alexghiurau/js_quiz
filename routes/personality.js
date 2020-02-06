const express = require('express');

const router = express.Router();
const User = require('../models/User');

// get personality from mongodb (user collection)

router.get('/:email', async (req, res) => {
  try {
    const personalityData = await User.findOne({ email: req.params.email }, "personality");
    res.json(personalityData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
