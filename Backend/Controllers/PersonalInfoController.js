const PersonalInfo = require('../Models/PersonalInfoModel');
const jwt = require("jsonwebtoken");
const Student = require("../models/StudentModel"); 


const StudentPersonalInfo = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.user_Id;

    console.log("Token:", token);
console.log("Decoded:", decoded);
console.log("Student ID from token:", studentId);
    const student = await Student.findById(studentId).select('email');
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const {
      name,
      fathername,
      phoneNumber,
      fatherphoneNumber,
      cnic,
      fatherCnic,
      dateOfBirth,
      address,
      disability,
      maritalStatus,
      religion,
      isFatherAlive,
      gender,
      bloodGroup,
    } = req.body;

    const file = req.file;

    const existingInfo = await PersonalInfo.findOne({ userId: studentId });
    if (existingInfo) {
      return res.status(400).json({ message: "Personal info already exists" });
    }

    const personalData = {
      userId: studentId,
      name ,
      email: student.email,
      fathername,
      phoneNumber,
      fatherphoneNumber,
      cnic,
      fatherCnic,
      dateOfBirth,
      address,
      disability,
      maritalStatus,
      religion,
      isFatherAlive,
      gender,
      bloodGroup,
      file: file ? file.path : null,
    };

    const personalInfo = await PersonalInfo.create(personalData);
    res.status(201).json({ message: "Personal info saved successfully", personalInfo });
  } catch (error) {
    console.error("Error saving personal info:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};



const getPersonalInfo = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const personalInfo = await PersonalInfo.findOne({ userId }).populate('userId', 'name email');
    if (!personalInfo) {
      const user = await User.findById(userId).select('name email');
      return res.status(200).json({ name: user.name, email: user.email });
    }

    res.status(200).json(personalInfo);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const updatePersonalInfo = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const existingInfo = await PersonalInfo.findOne({ userId });
    if (!existingInfo) {
      return res.status(404).json({ message: "Personal info not found" });
    }

    const updatedData = req.body;
    if (req.file) {
      updatedData.file = req.file.path;
    }

    const updatedInfo = await PersonalInfo.findOneAndUpdate(
      { userId },
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json({ message: "Personal info updated successfully", updatedInfo });
  } catch (error) {
    console.error("Error updating personal info:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};



module.exports = { StudentPersonalInfo, getPersonalInfo, updatePersonalInfo };
