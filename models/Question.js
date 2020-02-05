const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
