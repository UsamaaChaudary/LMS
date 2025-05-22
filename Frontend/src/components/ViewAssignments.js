import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAssignments.css";
import { FaCloudDownloadAlt } from "react-icons/fa";
import Lottie from "lottie-react";
import assignmentAnimation from "../animations/assignment-animation.json"; 

const ViewAssignments = () => {
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
      if (!userName) return; // Don't fetch if we don't have the user's name yet
      
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
  }, [userName]); // Add userName as dependency

  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  return (
    <div className="view-assignments-background">
      <div className="assignment-animation">
        <Lottie animationData={assignmentAnimation} loop={true} />
      </div>
      

      {loading ? (
        <div className="loading-text">Loading assignments...</div>
      ) : assignments.length > 0 ? (
        <div className="assignment-list">
          {assignments.map((assignment, index) => (
            <div key={index} className="assignment-card fade-in">
              <p><strong>🎓 Student Name:</strong> {assignment.studentName}</p>
              <p><strong>📑 Assignment Number:</strong> {assignment.assignmentNum}</p>
              <p><strong>📝 Title:</strong> {assignment.assignmentTitle}</p>
              <p><strong>⏳ Submission Date:</strong> {formatDate(assignment.dateOfSubmission)}</p>
              <p><strong>🖊️ Assignment Text:</strong> {assignment.assignmentText}</p>

              {assignment.file && (
                <a
                  href={`http://localhost:5000/uploads/${assignment.file}`}
                  download={assignment.file}
                  className="download-button"
                >
                  <FaCloudDownloadAlt className="download-icon" />
                  <span>Download {assignment.file}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-assignments-text">❌ No assignments submitted yet.</p>
      )}
    </div>
  );
};

export default ViewAssignments;