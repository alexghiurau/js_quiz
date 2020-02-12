const mongoose = require('mongoose');

// personality schema which goes inside use document
const PersonalitySchema = new mongoose.Schema({
    extraversion: {
      type: Number,
      required: true,
    },
    agreeableness: {
      type: Number,
      required: true,
    },
    conscientiousness: {
      type: Number,
      required: true,
    },
    emotionalStability: {
      type: Number,
      required: true,
    },
    opennessToExperience: {
      type: Number,
      required: true,
    },
});

// user document defines name/account details
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    default: false
  },
  personality: PersonalitySchema,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
