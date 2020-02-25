const express = require('express');

const router = express.Router();
const Result = require('../models/Result');

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
