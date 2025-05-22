const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["student", "teacher", "admin", "librarian", "canteen-person"] },
    verificationCode: { type: String },
    verified: { type: Boolean, default: false },
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },
    generatedID: { type: String, unique: true, sparse: true },
    isFeesPaid: { type: Boolean, default: false },
    feesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
