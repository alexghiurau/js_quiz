const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	quizId: {
		type: String,
		required: true,
	},
	score: {
		type: Number,
		required: true,
	},
	time: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model('results', resultSchema);