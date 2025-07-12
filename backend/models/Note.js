const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  link: String,
  tags: [String],
  content: String,
  user: {
    type: String,
    required: true   // Ensure every note is tied to a user
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
