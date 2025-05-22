const express = require("express");
const router = express.Router();
const { registerStudent , loginStudent , getStudentDetails }  = require("../controllers/StudentController");
const authMiddleware = require('../Middleware/authMiddleware');

router.post("/signup", registerStudent);
router.post("/login", loginStudent);
router.get("/getStudentDetails" ,getStudentDetails);

module.exports = router;
