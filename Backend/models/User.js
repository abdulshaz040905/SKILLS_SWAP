const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  skillsOffered: {
    type: [String], 
    default: []
  },
  skillsWanted: {
    type: [String],
    default: []
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpires: {
    type: Date
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;