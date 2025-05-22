import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./MarkAttendance.css";
import "./TeacherDashboard.css";
import Lottie from "lottie-react";
import attendanceAnimation from "../animations/attendance-animation.json"; 

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, courseRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/students"),
          axios.get("http://localhost:5000/api/courses"),
        ]);

        const studentUsers = studentRes.data.filter(user => user.role === "student");
        setStudents(studentUsers);

        const initialAttendance = {};
        studentUsers.forEach((student) => {
          initialAttendance[student._id] = "none";
        });
        setAttendance(initialAttendance);
        setCourses(courseRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAttendanceChange = (userId, status) => {
    setAttendance((prev) => ({ ...prev, [userId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!date || !selectedCourse) {
      alert("Please select both a date and a course.");
      return;
    }

    const selected = new Date(date);
    const month = selected.getMonth() + 1;
    const year = selected.getFullYear();
    const monthYear = `${month}-${year}`;

    const attendanceData = Object.keys(attendance)
      .filter((userId) => attendance[userId] !== "none")
      .map((userId) => ({
        userId,
        status: attendance[userId],
        courseId: selectedCourse,
        date,
        month,
        year,
        monthYear,
      }));

    try {
      await axios.post("http://localhost:5000/api/attendance", { attendanceData });
      alert("✅ Attendance saved successfully!");
      setAttendance({});
      setDate("");
      setSelectedCourse("");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("❌ Error saving attendance.");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="teacher-dashboard">
      <div className="teacher-sidebar">
        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/view-assignments")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>📋</span>
            <span>Assignments</span>
          </div>
        </button>
        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/order-food")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>🍽️</span>
            <span>Order Food</span>
          </div>
        </button>
        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/upload-result")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>📝</span>
            <span>Upload Result</span>
          </div>
        </button>
        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/upload-quiz")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>✍️</span>
            <span>Upload Quiz</span>
          </div>
        </button>
        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/mark-attendance")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>✅</span>
            <span>Attendance</span>
          </div>
        </button>
        <button className="teacher-sidebar-link teacher-logout-link" onClick={handleLogout}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>🔒</span>
            <span>Logout</span>
          </div>
        </button>
      </div>

      <motion.div
        className="mark-attendance-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-[-10px]">
          <Lottie
            animationData={attendanceAnimation}
            loop
            style={{ height: 80  }}
          />
        </div>

        <motion.h2
          className="text-3xl font-bold text-center mb-6 text-blue-700"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          📋 Mark Attendance
        </motion.h2>

        <div className="form-section">
          <div className="form-group">
            <label>Select Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Select Course:</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="student-table-wrapper">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{student.name}</td>
                  <td>
                    <button
                      className={`present ${attendance[student._id] === "present" ? "active" : ""}`}
                      onClick={() => handleAttendanceChange(student._id, "present")}
                    >
                      ✅
                    </button>
                  </td>
                  <td>
                    <button
                      className={`absent ${attendance[student._id] === "absent" ? "active" : ""}`}
                      onClick={() => handleAttendanceChange(student._id, "absent")}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.button
          className="save-attendance-button"
          onClick={handleSaveAttendance}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✅ Save Attendance
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MarkAttendance;
