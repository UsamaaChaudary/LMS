const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  bsfId: { type: String, required: true },
  daysRequested: { type: Number, required: true },
  bookName: { type: String, required: true },
  authorName: { type: String, required: true },
  dateOfRequest: { type: Date, default: Date.now },
  status: { type: String, default: "Request Submitted" },
  statusHistory: [{ type: String }]
});

module.exports = mongoose.model("Request", requestSchema);
