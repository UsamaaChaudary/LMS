const express = require("express");
const router = express.Router();
const {createPaymentIntent , recordPayment} = require("../controllers/OnlineFeeController");
const authenticateStudent = require('../middleware/authStudent');

router.post("/create-payment-intent", authenticateStudent , createPaymentIntent);
router.post("/record-payment", authenticateStudent  ,  recordPayment);

module.exports = router;
