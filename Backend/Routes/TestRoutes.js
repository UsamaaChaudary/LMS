const express = require('express');
const { generateMCQsHandler } = require('../Controllers/testController');
const router = express.Router();


router.post('/generate-mcqs', generateMCQsHandler);

module.exports = router;
