const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  assignmentNum: { type: String, required: true },
  assignmentTitle: { type: String, required: true },
  dateOfSubmission: { type: Date, required: true },
  submittedTo: { type: String, required: true },
  assignmentText: { type: String, required: false },
  file: { type: String },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
