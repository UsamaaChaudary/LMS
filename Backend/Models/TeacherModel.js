const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  courseAllocated: { type: String, required: true },
  dep: { type: String, required: true },
  sem: { type: String, required: true },
  section: { type: String, required: true, enum: ["Morning", "Evening"] },
});

module.exports = mongoose.model("Teacher", TeacherSchema);
