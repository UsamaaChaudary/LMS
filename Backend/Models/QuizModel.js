const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  quizNo: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  question: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

module.exports = mongoose.model("Quiz", QuizSchema);
