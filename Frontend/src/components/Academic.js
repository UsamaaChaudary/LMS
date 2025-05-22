import React, { useState , useEffect } from "react";
import { useNavigate }  from "react-router-dom"
import axios from "axios";
import "./Academic.css";
import profileIcon from '../assets/icons/student-profile-icon.png';
import { useRef } from 'react';


const AcademicForm = () => {
  const [academicDetails, setAcademicDetails] = useState({
    degreeLevel: "",
    degreeTitle: "",
    board: "",
    registrationNumber: "",
    passingYear: "",
    examinationType: "",
    marksType: "",
    obtainedMarks: "",
    totalMarks: "",
    sscMarksheet: null,
    hsscMarksheet: null,
    degreeLevel2: "",
    degreeTitle2: "",
    board2: "",
    registrationNumber2: "",
    passingYear2: "",
    examinationType2: "",
    marksType2: "",
    obtainedMarks2: "",
    totalMarks2: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);
  
  const [buttonText, setButtonText] = useState("Submit");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/admission/login");
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  const handleInputChange = (e) => {
    if (isSubmitted) return;
    const { name, value } = e.target;
    setAcademicDetails({ ...academicDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    if (isSubmitted) return;
    const { name, files } = e.target;
    setAcademicDetails({ ...academicDetails, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Submitting...");

    const formData = new FormData();
    for (const key in academicDetails) {
      formData.append(key, academicDetails[key]);
    }
    console.log("Form data being sent:", formData)
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("User is not authenticated.");
      setButtonText("Submit");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/academicDetails", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.isEligibleForTest) {
        alert("You are eligible! Redirecting to the test...");
        navigate("/admission/onlinetest");
      } else {
        alert(response.data.message);
      }

      console.log("Response from backend:", response.data);
      setButtonText("Submitted");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      setButtonText("Submit");
    }
  };

  return (
    
    <div className="academic-form-container">
      <div className="admission-profile-dropdown">
  <div
    className="admission-profile-icon"
    onClick={handleDropdownToggle}
    ref={profileIconRef}
  >
    <img src={profileIcon} alt="Profile Icon" style={{ width: "60px", height: "60px" }} />
  </div>
  {dropdownOpen && (
    <div className="admission-dropdown-menu" ref={dropdownRef}>
      <button onClick={() => navigate("/admission/personalinfo")}>Personal Details</button>
      <button onClick={() => navigate("/admission/selectprogram")}>Program Selection</button>
      <button onClick={() => navigate("/admission/academic")}>Academic Details</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
</div>

      <h2>Academic Form</h2>
      <form className="academic-form" onSubmit={handleSubmit}>
        <label>Degree Level:</label>
        <select
          name="degreeLevel"
          value={academicDetails.degreeLevel}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Degree Level</option>
          <option value="Matric">Matric</option>
        </select>

        <label>Degree Title:</label>
        <select
          name="degreeTitle"
          value={academicDetails.degreeTitle}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Degree Title</option>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
          <option value="Commerce">Commerce</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
        </select>

        <input
          type="text"
          name="board"
          placeholder="Board"
          value={academicDetails.board}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={academicDetails.registrationNumber}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />

        <label>Passing Year:</label>
        <select
          name="passingYear"
          value={academicDetails.passingYear}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Passing Year</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
        </select>

        <label>Examination Type:</label>
        <select
          name="examinationType"
          value={academicDetails.examinationType}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Examination Type</option>
          <option value="Annual">Annual</option>
          <option value="Supplementary">Supplementary</option>
        </select>

        <input
          type="number"
          name="obtainedMarks"
          placeholder="Obtained Marks"
          value={academicDetails.obtainedMarks}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />
        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={academicDetails.totalMarks}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />

        <label>Marks Type:</label>
        <select
          name="marksType"
          value={academicDetails.marksType}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Marks Type</option>
          <option value="Percentage">Percentage</option>
          <option value="CGPA">CGPA</option>
        </select>

        <label>Upload Marksheet:</label>
        <input type="file" name="sscMarksheet" onChange={handleFileChange} disabled={isSubmitted} required />

        <label>Second Degree Level:</label>
        <select
          name="degreeLevel2"
          value={academicDetails.degreeLevel2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Degree Level</option>
          <option value="Intermediate">Intermediate</option>
        </select>

        <label>Second Degree Title:</label>
        <select
          name="degreeTitle2"
          value={academicDetails.degreeTitle2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Degree Title</option>
          <option value="Science">Science</option>
          <option value="Arts">Arts</option>
          <option value="Commerce">Commerce</option>
          <option value="Engineering">Engineering</option>
          <option value="Medical">Medical</option>
        </select>

        <input
          type="text"
          name="board2"
          placeholder="Board"
          value={academicDetails.board2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />
        <input
          type="text"
          name="registrationNumber2"
          placeholder="Registration Number"
          value={academicDetails.registrationNumber2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />

        <label>Second Passing Year:</label>
        <select
          name="passingYear2"
          value={academicDetails.passingYear2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Passing Year</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
          <option value="2017">2017</option>
          <option value="2016">2016</option>
          <option value="2015">2015</option>
        </select>

        <label>Second Examination Type:</label>
        <select
          name="examinationType2"
          value={academicDetails.examinationType2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Examination Type</option>
          <option value="Annual">Annual</option>
          <option value="Supplementary">Supplementary</option>
        </select>

        <input
          type="number"
          name="obtainedMarks2"
          placeholder="Obtained Marks"
          value={academicDetails.obtainedMarks2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />
        <input
          type="number"
          name="totalMarks2"
          placeholder="Total Marks"
          value={academicDetails.totalMarks2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        />

        <label>Second Marks Type:</label>
        <select
          name="marksType2"
          value={academicDetails.marksType2}
          onChange={handleInputChange}
          disabled={isSubmitted}
          required
        >
          <option value="">Select Marks Type</option>
          <option value="Percentage">Percentage</option>
          <option value="CGPA">CGPA</option>
        </select>

        <label>Upload Marksheet:</label>
        <input type="file" name="hsscMarksheet" onChange={handleFileChange} disabled={isSubmitted} required />

        <button
          className="academic-submit-btn"
          type="submit"
          disabled={isSubmitted}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default AcademicForm;
