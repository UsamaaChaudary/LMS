const express = require('express');
const upload = require('../Middleware/uploadMiddlware'); 
const { submitFeeDetails } = require('../Controllers/feeController');
const router = express.Router();


router.post('/submit-fee', upload.single('screenshot'), submitFeeDetails);

module.exports = router;
