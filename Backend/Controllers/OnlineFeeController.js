const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/PaymentModel");
// const Student = require("../models/StudentModel");
const User = require("../models/UserModel");

const createPaymentIntent = async (req, res) => {
  const studentId = req.user.id;
  const { amount } = req.body;

  try {
    const student = await User.findOne({ userId: studentId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "pkr",
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const recordPayment = async (req, res) => {
  const userIdFromToken = req.user.id; // This is user._id from JWT

  try {
    const student = await User.findOne({ userId: userIdFromToken });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const charges = paymentIntent.charges?.data;
    const receiptUrl = charges && charges.length > 0 ? charges[0].receipt_url : null;

    const payment = new Payment({
      userId: student._id, // ✅ FIXED: use student's _id
      amount: paymentIntent.amount / 100,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      receipt_url: receiptUrl,
    });

    await payment.save();
    res.status(200).json({ message: "Payment recorded", payment });
  } catch (err) {
    console.error("Error recording payment:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createPaymentIntent,
  recordPayment,
};
