const express = require("express");
const router = express.Router();
const addProgramSelection = require("../Controllers/selectProgramController");
const authenticateStudent = require('../middleware/authStudent');

router.post('/selectProgram', authenticateStudent, addProgramSelection);


module.exports = router;


