const Teacher = require("../Models/TeacherModel");


const addTeacher = async (req, res) => {
  try {
    const { name, email, courseAllocated, dep, sem, section } = req.body;

    if (!name || !email || !courseAllocated || !dep || !sem || !section) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTeacher = new Teacher({ name, email, courseAllocated, dep, sem, section });
    await newTeacher.save();
    res.status(201).json({ message: "Teacher added successfully", teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



module.exports = addTeacher ;
