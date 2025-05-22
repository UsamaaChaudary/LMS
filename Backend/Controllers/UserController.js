const User = require("../Models/UserModel");
const Course = require("../Models/Coursemodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();



const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();  
};

const sendVerificationCode = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "University of Education: Your Verification Code",
        text: `Dear User,

You are registering at the University of Education, Attock Campus. Please use the following verification code to complete your registration process:

Verification Code: ${code}

If you did not request this registration, please disregard this email and do not share the code with anyone.

Thank you for choosing University of Education, Attock Campus. We are excited to have you with us.

Best regards,
University of Education, Attock Campus
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification code.");
    }
};


const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, department, semester, year } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verificationCode,
            department,
            semester,
            year
        });

        if (role === 'student') {
            const matchingCourses = await Course.find({
                department: department,
                semester: semester,
                year: year
            });

            if (matchingCourses.length > 0) {
                user.courses = matchingCourses.map(course => course._id);
            }
        }

        await user.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "User registered successfully. Please check your email for verification code." });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};


const verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        user.verified = true;
        user.verificationCode = undefined;  
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            message: "User verified successfully",
            token, 
            user: {
                id: user._id,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during verification.", error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role,  
            email: user.email,
            bsfId: user.generatedID,
        },
    });
};


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendPasswordResetCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
    const resetCode = generateVerificationCode();
        console.log(`Generated Reset Code for ${email}: ${resetCode}`);

        user.resetPasswordCode = resetCode; 
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
        console.log("After Saving User:", user);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Code",
            text: `Your password reset verification code is: ${resetCode}\nThis code will expire in 1 hour.`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset code sent to your email" });
    } catch (error) {
        console.error("Error sending reset code:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const resetPasswordWithCode = async (req, res) => {
    const { email, code, newPassword, confirmPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        console.log(`Received Code: ${code}`);
        console.log(`Stored Code: ${user.resetPasswordCode}`); 
        console.log(`Expiration Time: ${user.resetPasswordExpires}`);

        if (!user.resetPasswordCode || user.resetPasswordCode !== code || Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ message: "Invalid or expired reset code" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error" });
    }
};




const fetchUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name generatedID'); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

const getStudentsOnly = async (req, res) => {
    try {
      const students = await User.find({ role: "student" });
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error });
    }
  };


module.exports = { registerUser, loginUser, fetchUsers ,  resetPasswordWithCode, sendPasswordResetCode , verifyCode , getStudentsOnly };




