const mongoose = require("mongoose");

// personality schema which goes inside use document
const PersonalitySchema = new mongoose.Schema({
  extraversion: {
    type: String,
    required: true
  },
  agreeableness: {
    type: String,
    required: true
  },
  conscientiousness: {
    type: String,
    required: true
  },
  emotionalStability: {
    type: String,
    required: true
  },
  opennessToExperience: {
    type: String,
    required: true
  }
});

// user document defines name/account details
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  admin: {
    type: Boolean,
    default: false
  },
  personality: PersonalitySchema
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
