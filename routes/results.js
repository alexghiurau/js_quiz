const express = require('express');

const router = express.Router();
const Result = require('../models/Result');

// get results of a user
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const results = await Result.find({ userId: userId });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// posts results to mongo
router.post('/postresult', (req, res) => {
  try {
    const { userId, quizId, score, feedback, time } = req.body;
    const newResult = new Result({
      userId,
      quizId,
      score,
      feedback,
      time,
    });
    newResult.save();
    res.status(201);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
