const express = require('express');
const router = express.Router();
const  generateChallan  = require('../Controllers/challanController');

router.get('/generateChallan/:id', generateChallan);

module.exports = router;
