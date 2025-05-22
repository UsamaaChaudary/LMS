const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bsfId: { type: String, required: true, unique: true },
  year: { type: Number, required: true },
  sem: { type: Number, required: true },
  dep: { type: String, required: true },
  feePaid: { type: String, enum: ["Yes", "No" , "yes" , "no"], required: true },
});

module.exports = mongoose.model("NewStudent", StudentSchema);
