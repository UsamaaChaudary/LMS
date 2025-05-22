const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  generatedID: { type: String, unique: true, sparse: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
