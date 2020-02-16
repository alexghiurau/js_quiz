const express = require("express");

const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Quiz = require("../models/Quiz");

router.get("/dashboardQuiz", ensureAuthenticated, (req, res) => {
  const name = req.user.name;
  res.render("dashboardQuiz", { name });
});

router.get("/:difficulty", async (req, res) => {
  try {
    const quizes = await Quiz.findOne({ difficulty: req.params.difficulty });
    res.json(quizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const obj = require("../quizes/quizes.json");
    console.log(obj[0].questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/postquizes", async (req, res) => {
  try {
    Quiz.deleteMany({}, (err, data) => {
      console.log("cleared quiz collection");
    });
    const quizes = require("../quizes/quizes.json");
    quizes.forEach(quiz => {
      let newQuiz = new Quiz({
        difficulty: quiz.difficulty,
        questions: quiz.questions
      });
      newQuiz.save().then(data => data);
    });
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
