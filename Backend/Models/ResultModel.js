const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  bsfId: { type: String, required: true },
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  obtainedMarks: { type: Number, required: true },
  gpa: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
