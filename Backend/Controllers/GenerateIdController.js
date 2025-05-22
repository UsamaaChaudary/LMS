const Student = require('../Models/StudentModel'); 
const jwt = require('jsonwebtoken');

const generateAndAssignID = async (req, res) => {
  const { userId } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });



  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const student = await Student.findById(userId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // if (!student.isFeesPaid) return res.status(400).json({ message: 'Fee payment not verified' });
    if (student.generatedID) return res.status(400).json({ message: 'ID already generated' });

    const prefix = 'bsf2101';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const generatedID = `${prefix}${randomDigits}`;
    
    student.generatedID = generatedID;
    await student.save();
    res.status(200).json({ 
      message: `Generated ID: ${generatedID} has been assigned successfully!`, 
      generatedID 
    });
  } catch (error) {
    console.error('Error generating and assigning ID:', error);
    res.status(500).json({ message: 'Failed to generate and assign ID. Please try again.' });
  }
};

module.exports = generateAndAssignID;
