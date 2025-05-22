import React, { useState, useEffect , useRef } from "react";
import axios from "axios";
import "./SelectProgram.css"; 
import profileIcon from '../assets/icons/student-profile-icon.png';
import { useNavigate } from "react-router-dom";

const SelectProgramForm = () => {
  const [formData, setFormData] = useState({
    campus: "",
    degree: "",
    shift: "",
    program: "", 
  });
  const [buttonText, setButtonText] = useState("Save");
  const [isSaved, setIsSaved] = useState(false); 
   const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileIconRef = useRef(null);
    const navigate = useNavigate(); 
  

  useEffect(() => {
    
    const savedStatus = localStorage.getItem("isProgramSaved");
    if (savedStatus === "true") {
      setIsSaved(true);
      setButtonText("Saved");
    }

    const fetchProgramInfo = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/selectProgram/getSavedProgram", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.saved) {
          setIsSaved(true);
          setButtonText("Saved");
        }

        setFormData((prev) => ({
          ...prev,
          ...response.data,
        }));
      } catch (error) {
        console.error("Error fetching program info:", error);
      }
    };

    fetchProgramInfo();
  }, []);

  const handleInputChange = (e) => {
    if (isSaved) return; 
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Saving...");

    const token = localStorage.getItem("jwt"); 
    if (!token) {
      console.error("User is not authenticated.");
      setButtonText("Save");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/selectProgram", 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      setIsSaved(true);
      setButtonText("Saved");
      localStorage.setItem("isProgramSaved", "true"); 
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      setButtonText("Save");
    }
  };

  const handleNext = () => {
    navigate("/admission/academic");
  };
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const handleEdit = () => {
    setIsSaved(false);
    setButtonText("Save");
    localStorage.removeItem("isProgramSaved"); 
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsSaved(false);
    setButtonText("Save");
    navigate("/admission/login");
  };

useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileIconRef.current && !profileIconRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="select-program-container">
      <div className="profile-dropdown-container">
              <div
                className="profile-icon"
                onClick={handleDropdownToggle}
                ref={profileIconRef}
              >
                <img src={profileIcon} alt="Profile Icon" style={{ width: "60px", height: "60px" }} />
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <button onClick={() => navigate("/admission/personalinfo")}>Personal Details</button>
                  <button onClick={() => navigate("/admission/selectprogram")}>Program Selection</button>
                  <button onClick={() => navigate("/admission/academic")}>Academic Details</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
      <div className="select-program-form-container">
      <h2>Select Program</h2>
      <form className="select-program-form" onSubmit={handleSubmit}>
        <label>Campus:</label>
        <select 
          name="campus" 
          value={formData.campus} 
          onChange={handleInputChange} 
          disabled={isSaved} 
          required
        >
          <option value="">Select Campus</option>
          <option value="UE Attock Campus">Attock Campus</option>
          <option value="UE Bank Road Campus">UE Bank Road Campus</option>
          <option value="UE DG Khan Campus">UE DG Khan Campus</option>
          <option value="UE Faisalabad Campus">UE Faisalabad Campus</option>
          <option value="UE Jauharabad Campus">UE Jauharabad Campus</option>
          <option value="UE Multan Campus">UE Multan Campus</option>
          <option value="UE Lower Mall Campus Lahore">UE Lower Mall Campus Lahore</option>
        </select>
        
        <label>Degree:</label>
        <select 
          name="degree" 
          value={formData.degree} 
          onChange={handleInputChange} 
          disabled={isSaved} 
          required
        >
          <option value="">Select Degree</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
        </select>
        
        <label>Shift:</label>
        <select 
          name="shift" 
          value={formData.shift} 
          onChange={handleInputChange} 
          disabled={isSaved} 
          required
        >
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
        </select>

        <label>Program:</label>
        <select 
          name="program" 
          value={formData.program} 
          onChange={handleInputChange} 
          disabled={isSaved} 
          required
        >
          <option value="">Select Program</option>
          <option value="BS English">BS English</option>
          <option value="BS Mathematics">BS Mathematics</option>
          <option value="BS Computer Science">BS Computer Science</option>
          <option value="B.Ed">B.Ed</option>
          <option value="BS Chemistry">BS Chemistry</option>
          <option value="BS Physics">BS Physics</option>
          <option value="BS Zoology">BS Zoology</option>
        </select>

        <button 
          className="program-save-btn" 
          type="submit" 
          disabled={isSaved}
        >
          {buttonText}
        </button>
       
        <button 
          className="program-next-btn" 
          type="button" 
          onClick={handleNext}
        >
          Next
        </button>
      </form>
    </div>
    </div>
  );
};

export default SelectProgramForm;
