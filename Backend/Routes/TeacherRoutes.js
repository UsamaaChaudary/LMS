const express = require("express");
const  addTeacher  = require("../Controllers/teacherController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/add-teacher", authMiddleware, addTeacher);

module.exports = router;
