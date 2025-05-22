import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import assignmentAnimation from "../animations/assignment-animation.json";
import "./UploadAssignment.css";
import assignmentLogo from "../assets/icons/assignment-logo.png";
import bookLogo from "../assets/icons/book-logo.png";
import canteenLogo from "../assets/icons/order-food-logo.png";
import checkedLogo from "../assets/icons/checked.png";
import resultLogo from "../assets/icons/result-logo.png";
import logOutLogo from "../assets/icons/loggout.png";
import submitFee from "../assets/icons/fee-logo.png";
import coursesLogo from "../assets/icons/courses-logo.png";

const UploadAssignment = () => {
  const navigate = useNavigate();
  const [assignmentDetails, setAssignmentDetails] = useState({
    studentName: "",
    assignmentNum: "",
    assignmentTitle: "",
    dateOfSubmission: "",
    submittedTo: "",
    assignmentText: "",
    file: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAssignmentDetails((prevDetails) => ({
        ...prevDetails,
        studentName: user.name || "",
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignmentDetails({ ...assignmentDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    setAssignmentDetails({ ...assignmentDetails, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(assignmentDetails).forEach((key) => {
      if (assignmentDetails[key]) {
        formData.append(key, assignmentDetails[key]);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/assignments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const studentName = assignmentDetails.studentName;
      setAssignmentDetails({
        studentName,
        assignmentNum: "",
        assignmentTitle: "",
        dateOfSubmission: "",
        submittedTo: "",
        assignmentText: "",
        file: null,
      });

      document.querySelector('input[type="file"]').value = null;

    } catch (error) {
      console.error("Error uploading assignment:", error);
      
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="upload-assignment-page">
      <div className="dashboardSidebar">
        <div className="sidebarLink" onClick={() => navigate("/student-dashboard")}>
          <div className="sidebarText" style={{ display: "flex", alignItems: "flex-start" }}>
            <span style={{ fontSize: "24px", marginRight: "15px" , marginTop: "-10px" }}>📊</span>
            <span style={{ fontSize: "14px", position: "relative", top: "-1px" }}>Dashboard</span>
          </div>
        </div>

        

        <div className="sidebarLink" onClick={() => navigate("/request-book")}>
          <img
            src={bookLogo}
            alt="book logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Request Book</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/order-food")}>
          <img
            src={canteenLogo}
            alt="canteen logo"
            style={{ width: "50px", height: "30px", marginLeft: -10 }}
          />
          <div className="sidebarText" style={{ marginLeft: -10 }}>Order Food</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/my-approvals")}>
          <img
            src={checkedLogo}
            alt="checked logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">My Approvals</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/results")}>
          <img
            src={resultLogo}
            alt="result logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Result</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/submit-fee")}>
          <img
            src={submitFee}
            alt="fee submit logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Fee Submit</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/courses")}>
          <img
            src={coursesLogo}
            alt="courses logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Courses</div>
        </div>

        <div className="sidebarLink" onClick={handleLogout}>
          <img
            src={logOutLogo}
            alt="logout logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Logout</div>
        </div>
      </div>

      <div className="upload-assignment-background">
        <div className="upload-assignment-container">
          <Lottie animationData={assignmentAnimation} loop={true} className="upload-animation" />

          <form className="upload-assignment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="studentName"
                placeholder="Student Name"
                value={assignmentDetails.studentName}
                disabled
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="assignmentNum"
                placeholder="Assignment No."
                value={assignmentDetails.assignmentNum}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="assignmentTitle"
                placeholder="Title"
                value={assignmentDetails.assignmentTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                name="dateOfSubmission"
                value={assignmentDetails.dateOfSubmission}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="submittedTo"
                placeholder="Submitted To"
                value={assignmentDetails.submittedTo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="assignmentText"
                placeholder="Write your assignment here."
                value={assignmentDetails.assignmentText}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <input 
                type="file" 
                name="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
            </div>

            <button type="submit" className="submit-assignment-btn">
              Submit Assignment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadAssignment;
