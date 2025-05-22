const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    degreeLevel: { type: String, required: true },
    degreeTitle: { type: String, required: true },
    board: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    passingYear: { type: Number, required: true },
    examinationType: { type: String, required: true },
    marksType: { type: String, required: true },
    obtainedMarks: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    marksheet: { type: String },
    degreeLevel2: { type: String, required: true },
    degreeTitle2: { type: String, required: true },
    board2: { type: String, required: true },
    registrationNumber2: { type: String, required: true },
    passingYear2: { type: Number, required: true },
    examinationType2: { type: String, required: true },
    marksType2: { type: String, required: true },
    obtainedMarks2: { type: Number, required: true },
    totalMarks2: { type: Number, required: true },
    marksheet2: { type: String },
    TestMeritPercentage: { type: Number, required: true }, 
    isEligibleForTest: { type: Boolean, default: false },
    mcqScore: { type: Number, default: 0 }, 
    finalMeritPercentage: { type: Number }, 
    isEligibleForMeritList: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicQualification', academicSchema);
