const ProgramSelection = require("../Models/SelectProgramModel");

const addProgramSelection = async (req, res) => {
  const studentId = req.user.id;
  const { campus, degree, shift, program } = req.body;

  try {
    const existingSelection = await ProgramSelection.findOne({ userId: studentId });
    if (existingSelection) {
      return res.status(400).json({ message: "Program selection already exists" });
    }

    const newSelection = await ProgramSelection.create({
      userId: studentId,
      campus,
      degree,
      shift,
      program
    });

    res.status(201).json({ message: "Program selection added successfully", data: newSelection });
  } catch (error) {
    res.status(500).json({ message: "Error adding program selection", error });
  }
};

module.exports = addProgramSelection;
