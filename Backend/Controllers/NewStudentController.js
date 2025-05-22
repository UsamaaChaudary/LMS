const Student = require("../Models/NewStudentModel");

const addStudent = async (req, res) => {
  try {
    const { name, bsfId, year, sem, dep, feePaid } = req.body;

    const normalizedFeePaid = feePaid.toLowerCase();

if (!["yes", "no"].includes(normalizedFeePaid)) {
  return res.status(400).json({ message: "Invalid feePaid value. Choose 'Yes' or 'No'." });
}

    // Check if student already exists
    const existingStudent = await Student.findOne({ bsfId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this BSF ID already exists." });
    }

    // Save new student
    const newStudent = new Student({ name, bsfId, year, sem, dep, feePaid : normalizedFeePaid });
    await newStudent.save();

    res.status(201).json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Error adding student.", error });
  }
};

module.exports = addStudent;
