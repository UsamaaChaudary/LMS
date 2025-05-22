const Student = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require('dotenv').config();

const registerStudent = async (req, res) => {
  try {
    const { cnic, email, password, phone } = req.body;

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingCnic = await Student.findOne({ cnic });
    if (existingCnic) {
      return res.status(400).json({ message: "CNIC already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      cnic,
      email,
      password: hashedPassword,
      phone,
    });

    await newStudent.save();
    res.status(201).json({ message: "Student admitted successfully" });
  } catch (err) {
    console.error("Student admission error:", err);
    res.status(500).json({ message: "Server error during admission" });
  }
};


const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ user_Id: student._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({
        token,
        student: {
            user_Id: student._id,
            name: student.name,
            email: student.email,
        },
    });
};
 

const getStudentDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findById(decoded.user_Id).select("name email cnic");
    console.log("Decoded JWT:", decoded);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error getting student details:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { registerStudent , loginStudent , getStudentDetails }
