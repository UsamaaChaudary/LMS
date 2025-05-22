const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  amount: { type: Number, required: true },
  paymentIntentId: { type: String, required: true },
  status: { type: String, required: true },
  receipt_url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
