const Quiz = require("../Models/QuizModel");



const uploadQuiz = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body); 
    console.log("Received File:", req.file); 

    const { quizNo, date, time, question } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "File is required!" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newQuiz = new Quiz({ quizNo, date, time, question, fileUrl });
    await newQuiz.save();

    res.status(201).json({ message: "Quiz uploaded successfully!", quiz: newQuiz });
  } catch (error) {
    console.error("Error uploading quiz:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Server Error" });
  }
};



module.exports = { uploadQuiz, getAllQuizzes };
