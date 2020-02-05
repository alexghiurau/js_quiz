const express = require('express');

const router = express.Router();
const Question = require('../models/Question');

// smh tbh famalamadingdong

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
