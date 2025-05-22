const axios = require('axios');


const categories = {
  maths: 19,
  english: 9,
  physics: 17,
  chemistry: 17,
  'computer science': 18,
};

const generateMCQs = async (subject) => {
  const categoryId = categories[subject.toLowerCase()];

  if (!categoryId) {
    throw new Error('Subject not supported for quiz generation.');
  }

  try {
    const response = await axios.get('https://opentdb.com/api.php', {
      params: {
        amount: 8, 
        category: categoryId,
        type: 'multiple', 
        difficulty: 'easy', 
      },
    });

    return response.data.results;
  } catch (error) {
    throw new Error('Error generating MCQs: ' + error.message);
  }
};



const generateMCQsHandler = async (req, res) => {
  const { subject } = req.body;

  if (!subject) {
    return res.status(400).json({ message: 'Subject is required.' });
  }

  try {
    const mcqs = await generateMCQs(subject);
    res.status(200).json({ mcqs });
  } catch (error) {
    res.status(500).json({ message: 'Error generating MCQs', error: error.message });
  }
};



module.exports = { generateMCQsHandler };
