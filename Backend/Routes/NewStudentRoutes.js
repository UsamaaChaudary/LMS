const express = require("express");
const addStudent  = require("../Controllers/newStudentController.js");
const authMiddleware = require("../Middleware/authMiddleware.js"); 

const router = express.Router();

router.post("/add-student", authMiddleware, addStudent);

module.exports = router;
