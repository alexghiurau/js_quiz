const express = require('express');

const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Result = require('../models/Result');

// router.get('/:difficulty', async (req, res) => {
// 	try {
// 		const quizes = await Quiz.findOne({ difficulty: req.params.difficulty });
// 		res.json(quizes);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// });

router.get('/', (req, res) => {
	res.status(200);
	res.send('get werks');
});

router.post('/postresult', (req, res) => {
	try {
		const { userId, quizId, score, time } = req.body;
		const newResult = new Result({
			userId,
			quizId,
			score,
			time,
		});
		newResult.save();
		res.status(201);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
