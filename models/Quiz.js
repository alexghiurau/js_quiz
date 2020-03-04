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

// return a random document from Quiz collection

quizSchema.statics.random = async function() {
	const count = await this.countDocuments();
	const rand = Math.floor(Math.random() * count);
	const randomDoc = await this.findOne().skip(rand);
	return randomDoc;
};

module.exports = mongoose.model('quizes', quizSchema);
