const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
	question: {
		type: String,
		required: true,
	},
	balls: {
		type: Array,
		required: true,
	},
	cups: {
		type: Number,
		required: true,
	},
});

const quizSchema = new mongoose.Schema({
	difficulty: {
		type: String,
		required: true,
	},
	questions: [questionSchema],
});

module.exports = mongoose.model('quizes', quizSchema);
