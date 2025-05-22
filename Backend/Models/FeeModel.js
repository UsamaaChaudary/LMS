const mongoose = require('mongoose');

const feeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bankAccount: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    screenshot: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
