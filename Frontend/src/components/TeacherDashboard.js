import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
   const [userName, setUserName] = useState("");
  
    useEffect(() => {
      // Get user data from local storage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUserName(userData.name);
      }
    }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!userName) return; 
      try {
        const response = await axios.get(
          `http://localhost:5000/api/assignments?submittedTo=${encodeURIComponent(userName)}`
        );
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [userName]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
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
  
    
    <div className="teacher-dashboard-content">
      <h2 className="teacher-dashboard-heading">Teacher Dashboard</h2>
  
      {loading ? (
        <div className="loading-text">Loading assignments...</div>
      ) : (
        <div className="teacher-assignment-grid">
          {assignments.map((assignment, index) => (
            <div key={index} className="teacher-assignment-card">
              <p><strong>🎓 Student Name:</strong> {assignment.studentName}</p>
              <p><strong>📑 Assignment Number:</strong> {assignment.assignmentNum}</p>
              <p><strong>📝 Title:</strong> {assignment.assignmentTitle}</p>
              <p><strong>⏳ Submission Date:</strong> {formatDate(assignment.dateOfSubmission)}</p>
              <p><strong>🖊️ Assignment Text:</strong> {assignment.assignmentText}</p>
  
              {assignment.file && (
                <a
                  href={`http://localhost:5000/uploads/${assignment.file}`}
                  download={assignment.file}
                  className="teacher-download-button"
                >
                  📥 Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
    );
};

export default TeacherDashboard;
