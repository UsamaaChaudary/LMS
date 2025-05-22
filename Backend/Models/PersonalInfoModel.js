const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true },
  fathername: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  fatherphoneNumber: { type: String, required: true },
  cnic: { type: String, required: true },
  fatherCnic: { type: String },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  disability: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  religion: { type: String, required: true },
  isFatherAlive: { type: String, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  file: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PersonalInfo', PersonalInfoSchema);
