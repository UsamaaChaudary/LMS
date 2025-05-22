import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddTeacher.css";
import backgroundImage from '../assets/images/admin2.jpg'; // Same background for consistency
import Lottie from 'lottie-react';
import teacherAnimation from '../animations/teacher-animation.json';

const API_URL = "http://localhost:5000";

const AddTeacher = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    courseAllocated: "",
    dep: "",
    sem: "",
    section: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { name, email, courseAllocated, dep, sem, section } = formData;
    if (!name || !email || !courseAllocated || !dep || !sem || !section) {
      alert("❌ Please fill in all fields.");
      return;
    }
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("❌ Authentication Error. Please log in again.");
        return;
      }
      await axios.post(`${API_URL}/api/teachers/add-teacher`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Teacher added successfully!");
      setFormData({
        name: "",
        email: "",
        courseAllocated: "",
        dep: "",
        sem: "",
        section: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add teacher. Please try again.");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="teacher-admin-dashboard">
      <div className="teacher-admin-sidebar">
        <button className="teacher-admin-sidebar-link" onClick={() => navigate("/admin-dashboard")}>
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button className="teacher-admin-sidebar-link" onClick={() => handleNavigate('/upload-news')}>
          <span>📰</span>
          <span>Upload News</span>
        </button>
        <button className="teacher-admin-sidebar-link" onClick={() => handleNavigate('/approvals')}>
          <span>✅</span>
          <span>Approvals</span>
        </button>
        <button className="teacher-admin-sidebar-link" onClick={() => handleNavigate('/add-student')}>
          <span>🎓</span>
          <span>Add New Student</span>
        </button>
        <button className="teacher-admin-sidebar-link" onClick={() => handleNavigate('/addcourse')}>
          <span>📚</span>
          <span>Allocate Courses</span>
        </button>
        <button className="teacher-admin-sidebar-link" onClick={() => handleNavigate('/admission/cmeritlist')}>
          <span>🏆</span>
          <span>See MeritList</span>
        </button>
        <button className="teacher-admin-sidebar-link teacher-admin-logout-link" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      <div className="teacher-admin-dashboard-content" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '1120px 700px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className="teacher-form-container">
          <div className="teacher-animation-container">
            <Lottie animationData={teacherAnimation} style={{ width: 200, height: 200 }} />
          </div>
        
          <input name="name" placeholder="Teacher Name" value={formData.name} onChange={handleInputChange} className="teacher-input" />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="teacher-input" />
          <input name="courseAllocated" placeholder="Course Allocated" value={formData.courseAllocated} onChange={handleInputChange} className="teacher-input" />
          <input name="dep" placeholder="Department" value={formData.dep} onChange={handleInputChange} className="teacher-input" />
          <input name="sem" type="number" placeholder="Semester" value={formData.sem} onChange={handleInputChange} className="teacher-input" />
          <select name="section" value={formData.section} onChange={handleInputChange} className="teacher-input">
            <option value="">Select Section</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
          <button className="teacher-submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
