const Assignment = require("../Models/AssignmentModel");


const submitAssignment = async (req, res) => {
  try {
    const { studentName, assignmentNum, assignmentTitle, dateOfSubmission, submittedTo, assignmentText } = req.body;
    const file = req.file ? req.file.filename : null;

    const parsedDate = new Date(dateOfSubmission);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const newAssignment = new Assignment({
      studentName,
      assignmentNum,
      assignmentTitle,
      dateOfSubmission: parsedDate, 
      submittedTo,
      assignmentText,
      file,
    });

    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    res.status(400).json({ message: "Error submitting assignment", error });
  }
};
   

const getAssignments = async (req, res) => {
  try {
    const { submittedTo } = req.query;
    let query = {};
    
    if (submittedTo) {
      query.submittedTo = submittedTo;
    }
    
    const assignments = await Assignment.find(query);
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};

module.exports = { submitAssignment, getAssignments };
