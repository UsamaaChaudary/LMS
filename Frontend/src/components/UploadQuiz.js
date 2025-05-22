import React, { useState } from "react";
import "./UploadQuiz.css";
import "./TeacherDashboard.css";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import quizAnimation from "../animations/quiz-animation.json";

const UploadQuiz = () => {
  const navigate = useNavigate();
  const [quizNo, setQuizNo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadQuiz = (e) => {
    e.preventDefault();
    if (!quizNo || !date || !time || !question || !file) {
      alert("All fields are required!");
      return;
    }

    alert("Quiz uploaded successfully!");

    setQuizNo("");
    setDate("");
    setTime("");
    setQuestion("");
    setFile(null);
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

        <button className="teacher-sidebar-link" onClick={() => handleNavigation("/upload-result")}>
          <div style={{ display: "flex", alignItems: "center", padding: "0 15px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>📝</span>
            <span>Upload Result</span>
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

      <div className="upload-quiz-background">
        <form className="quiz-form" onSubmit={handleUploadQuiz}>
          <div className="quiz-animation">
            <Lottie animationData={quizAnimation} loop={true} />
          </div>

          {/* Quiz Number */}
          <input
            type="number"
            placeholder="Quiz No."
            value={quizNo}
            onChange={(e) => setQuizNo(e.target.value)}
            className="quiz-input"
          />

          <div className="input-wrapper">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="quiz-input real-input"
            />
            <span className="placeholder-text">{date ? date : "Choose Date"}</span>
          </div>

          <div className="input-wrapper">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="quiz-input real-input"
            />
            <span className="placeholder-text">{time ? time : "Choose Time"}</span>
          </div>

          {/* Quiz Question */}
          <textarea
            placeholder="Enter Quiz Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="quiz-input textarea"
          />

          {/* File Upload */}
          <label className="file-upload-button">
            📂 {file ? file.name : "Choose File"}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          {/* Submit Button */}
          <button type="submit" className="upload-button">
            Upload Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadQuiz;
