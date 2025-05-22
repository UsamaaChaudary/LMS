const express = require('express');
const  generateAndAssignID  = require('../Controllers/generateIdController');
const router = express.Router();



router.put('/generate-id', generateAndAssignID);



module.exports = router;
