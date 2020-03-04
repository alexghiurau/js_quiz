const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Quiz = require('../models/Quiz');

router.get('/dashboardQuiz', ensureAuthenticated, (req, res) => {
	const { name } = req.user;
	res.render('dashboardQuiz', { name });
});

// router.get('/:difficulty', async (req, res) => {
// 	try {
// 		const quizes = await Quiz.findOne({ difficulty: req.params.difficulty });
// 		res.json(quizes);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// });

// gets single random quiz

router.get('/', async (req, res) => {
	try {
		const quiz = await Quiz.random();
		res.json(quiz);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// gets a specific quiz

router.get('/:id', async (req, res) => {
	const quizId = req.params.id;
	try {
		const quiz = await Quiz.findById(quizId);
		res.json(quiz);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// posts quizes from quizes.json file

router.post('/postquizes', async (req, res) => {
	try {
		Quiz.deleteMany({}, (err, data) => {
			console.log('cleared quiz collection');
		});
		const quizes = require('../quizes/quizes.json');
		quizes.forEach(quiz => {
			const newQuiz = new Quiz({
				difficulty: quiz.difficulty,
				questions: quiz.questions,
			});
			newQuiz.save().then(data => data);
		});
		res.end();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
