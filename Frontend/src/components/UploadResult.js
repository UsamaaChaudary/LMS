import React, { useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import * as resultAnimation from "../animations/result-animation.json";
import { useNavigate } from "react-router-dom";
import "./UploadResult.css";
import "./TeacherDashboard.css";

const UploadResult = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    bsfId: "",
    subject: "",
    totalMarks: "",
    obtainedMarks: "",
    gpa: "",
    parentEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:5000/api/results/upload",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("bsfId", formData.bsfId);
      alert(response.data.message);

      // Reset form
      setFormData({
        studentName: "",
        bsfId: "",
        subject: "",
        totalMarks: "",
        obtainedMarks: "",
        gpa: "",
        parentEmail: "",
      });
    } catch (error) {
      console.error("Error uploading result:", error);
      alert("Error uploading result.");
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
        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/teacher-dashboard")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>📊</span>
            <span>Dashboard</span>
          </div>
        </button>
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

      <div className="upload-result-page">
        <div className="upload-result-form-container">
          <div className="upload-result-animation-container">
            <Lottie animationData={resultAnimation} loop={true} />
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Student Name"
              required
            />
            <input
              type="text"
              name="bsfId"
              value={formData.bsfId}
              onChange={handleChange}
              placeholder="BSF ID"
              required
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
            />
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              placeholder="Total Marks"
              required
            />
            <input
              type="number"
              name="obtainedMarks"
              value={formData.obtainedMarks}
              onChange={handleChange}
              placeholder="Obtained Marks"
              required
            />
            <input
              type="number"
              step="0.01"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              placeholder="GPA"
              required
            />
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              placeholder="Parent's Email"
              required
            />
            <button type="submit" className="upload-result-submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResult;
