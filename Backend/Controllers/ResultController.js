const Result = require('../Models/ResultModel');
const nodemailer = require('nodemailer');


const uploadResult = async (req, res) => {
    try {
        const { bsfId, subject, studentName, totalMarks, obtainedMarks, gpa, parentEmail } = req.body;
        const result = new Result({ bsfId, subject, studentName, totalMarks, obtainedMarks, gpa });
        await result.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });
        const resultLink = `http://localhost:3000/results?bsfId=${bsfId}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: parentEmail,
            subject: `Result Available for BSF ID: ${bsfId}`,
            text: `Your child's result has been uploaded. You can view it at: ${resultLink}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: "Result uploaded and email sent to parent." });
    } catch (error) {
        console.error("Error uploading result or sending email:", error);
        res.status(500).json({ message: "Failed to upload result." });
    }
};



const getResultsByStudent = async (req, res) => {
    try {
        const { studentName } = req.query;
        if (!studentName) {
            return res.status(400).json({ message: "Student name is required" });
        }
        const results = await Result.find({ studentName });
        if (!results.length) {
            return res.status(404).json({ message: "No results found" });
        }
        res.json(results);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ message: "Failed to fetch results" });
    }
};



module.exports = { uploadResult , getResultsByStudent };