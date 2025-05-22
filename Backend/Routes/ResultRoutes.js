const express = require("express");
const { uploadResult , getResultsByStudent  } = require("../Controllers/resultController");
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();


router.post("/upload", uploadResult);
router.get('/student-results', authMiddleware , getResultsByStudent);


module.exports = router;
