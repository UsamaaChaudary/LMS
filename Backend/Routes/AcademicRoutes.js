const express = require('express');
const authenticateStudent = require('../middleware/authStudent');
const upload = require("../Middleware/uploadMiddlware")
const {addAcademicQualification , saveTestResult}   = require('../Controllers/academicController');
const router = express.Router();



router.post('/academicDetails', authenticateStudent ,  upload.fields([
  { name: 'sscMarksheet', maxCount: 1 },
  { name: 'hsscMarksheet', maxCount: 1 }
]), addAcademicQualification);

router.post('/saveTestResult', authenticateStudent ,  saveTestResult);

module.exports = router;
