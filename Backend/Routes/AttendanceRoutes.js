const express = require('express');
const { markAttendance , getAttendanceByUserId } = require('../Controllers/attendanceController');
const router = express.Router();

router.post('/', markAttendance); 
router.get("/:userId", getAttendanceByUserId);

module.exports = router;
