const express = require('express');

const router = express.Router();
// const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// get questions from mongodb

router.get('/:id', async (req, res) => {
  try {
    const quizes = await Quiz.findById(req.params.id);
    res.json(quizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
