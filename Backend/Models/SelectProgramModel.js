const mongoose = require('mongoose');

const programSelectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, 
  campus: {
    type: String,
    required: true,
    enum: [
      "UE Attock Campus",
      "UE Bank Road Campus",
      "UE DG Khan Campus",
      "UE Faisalabad Campus",
      "UE Jauharabad Campus",
      "UE Multan Campus",
      "UE Lower Mall Campus Lahore"
    ],
  },
  degree: {
    type: String,
    required: true,
    enum: ["Bachelors", "Masters"]
  },
  shift: {
    type: String,
    required: true,
    enum: ["Morning", "Evening"]
  },
  program: {
    type: String,
    required: true,
    enum: [
      "BS English",
      "BS Mathematics",
      "BS Computer Science",
      "B.Ed",
      "BS Chemistry",
      "BS Physics",
      "BS Zoology"
    ]
  },
}, { timestamps: true });

module.exports = mongoose.model('ProgramSelection', programSelectionSchema);
