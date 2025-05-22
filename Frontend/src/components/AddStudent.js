import React, { useEffect ,useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./AddStudent.css";
import backgroundImage from '../assets/images/admin2.jpg';
import Lottie from 'lottie-react';
import studentAnimation from '../animations/student-animation.json';

const AddStudentPage = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bsfId: "",
    year: "",
    sem: "",
    dep: "",
    feePaid: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, bsfId, year, sem, dep, feePaid } = formData;
    if (!name || !bsfId || !year || !sem || !dep || !feePaid) {
      alert("Please fill all fields.");
      return;
    }
    try {
      
      const token = localStorage.getItem("jwt");
      await axios.post("http://localhost:5000/api/students/add-student",
         formData  ,
         {
         headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        );
      alert("Student added successfully!");
      setFormData({ name: "", bsfId: "", year: "", sem: "", dep: "", feePaid: "" });
    } catch {
      alert("Failed to add student.");
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
    <div className="student-admin-dashboard" >
       <div className="student-admin-sidebar">
        <button className="student-admin-sidebar-link" onClick={() => navigate("/admin-dashboard")}>
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button className="student-admin-sidebar-link" onClick={() => handleNavigate('/upload-news')}>
          <span>📰</span>
          <span>Upload News</span>
        </button>
        <button className="student-admin-sidebar-link" onClick={() => handleNavigate('/approvals')}>
          <span>✅</span>
          <span>Approvals</span>
        </button>
        <button className="student-admin-sidebar-link" onClick={() => handleNavigate('/add-teacher')}>
          <span>👨‍🏫</span>
          <span>Add New Teacher</span>
        </button>
        <button className="student-admin-sidebar-link" onClick={() => handleNavigate('/addcourse')}>
          <span>📚</span>
          <span>Allocate Courses</span>
        </button>
        <button className="student-admin-sidebar-link" onClick={() => handleNavigate('/admission/meritlist')}>
          <span>🏆</span>
          <span>See MeritList</span>
        </button>
        <button className="student-admin-sidebar-link student-admin-logout-link" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      <div className="studnet-admin-dashboard-content" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '1120px 700px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <div className="student-form-container" >
        <div className="student-animation-container">
          <Lottie animationData={studentAnimation} style={{ width: 200, height: 200 }} />
        </div>
        
        <input name="name" placeholder="Student Name" value={formData.name} onChange={handleChange} className="student-input" />
        <input name="bsfId" placeholder="BSF ID" value={formData.bsfId} onChange={handleChange} className="student-input" />
        <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} className="student-input" />
        <input name="sem" type="number" placeholder="Semester" value={formData.sem} onChange={handleChange} className="student-input" />
        <input name="dep" placeholder="Department" value={formData.dep} onChange={handleChange} className="student-input" />
        <select name="feePaid" value={formData.feePaid} onChange={handleChange} className="student-input">
          <option value="">Select Fee Status</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <button className="student-submit-button" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
    </div>
  );
};

export default AddStudentPage;
