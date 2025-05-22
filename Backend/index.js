const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const userRoutes = require('./Routes/UserRoutes');
const canteenRoutes = require('./Routes/CanteenRoutes');
const assignmentRoutes = require('./Routes/AssignmentRoutes');
const attendanceRoutes = require('./Routes/AttendanceRoutes');
const bookRoutes = require('./Routes/BookRoutes');
const requestRoutes = require('./Routes/RequestBookRoutes');
const resultRoutes = require('./Routes/ResultRoutes');
const StudentPersonalInfo = require('./Routes/PersonalInfoRoutes'); 
const selectProgramRoutes = require('./Routes/SelectProgramRoute'); 
const academicRoutes = require('./Routes/AcademicRoutes'); 
const testRoutes = require('./Routes/TestRoutes');
const challanRoutes = require('./Routes/ChallanRoutes');
const meritRoutes = require('./Routes/MeritRoutes');
const generateIdRoutes = require('./Routes/GenerateIdRoutes');
const createCourse=require('./Routes/CourseRoutes')
const submitFeeDetails =require('./Routes/FeeRoutes')
const quizRoutes = require("./Routes/QuizRoutes");
const newsRoutes = require("./Routes/NewsRoutes");
const newStudentRoutes = require("./Routes/NewStudentRoutes");
const teacherRoutes = require("./Routes/TeacherRoutes");
const studentRoutes = require("./routes/StudentRoutes");
const OnlineFee = require("./routes/OnlineFeeRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "*", 
    credentials: true,
    exposedHeaders: ["authorization"],
  }


  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/canteen', canteenRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/results', resultRoutes);
app.use('/api', StudentPersonalInfo); 
app.use('/api', selectProgramRoutes); 
app.use('/api', academicRoutes ); 
app.use('/api', testRoutes);
app.use('/api', challanRoutes);
app.use('/api', meritRoutes);
app.use('/api', generateIdRoutes);
app.use('/api',createCourse);
app.use('/api',submitFeeDetails);
app.use("/api", quizRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/students", newStudentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admission", studentRoutes);
app.use("/api/payment", OnlineFee);


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully..."))
    .catch((err) => console.log("MongoDB Connection Error:", err));


    
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
  });
  