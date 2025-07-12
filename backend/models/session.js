const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,  // important: enforce user association
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
