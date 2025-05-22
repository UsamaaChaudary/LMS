const express = require('express');
const authenticateStudent = require('../middleware/authStudent');
const getMeritList = require('../Controllers/meritController');
const router = express.Router();

router.get('/meritList',authenticateStudent , getMeritList);

module.exports = router;
