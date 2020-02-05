const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
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

module.exports = mongoose.model('question', questionSchema);
