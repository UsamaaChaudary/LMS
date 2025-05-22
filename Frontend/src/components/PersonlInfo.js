import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import profileIcon from '../assets/icons/student-profile-icon.png'; 
import './PersonalInfo.css';

const PersonalInfo = () => {
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    email: "",
    fathername: "",
    phoneNumber: "",
    fatherphoneNumber: "",
    cnic: "",
    fatherCnic: "",
    dateOfBirth: "",
    address: "",
    disability: "",
    maritalStatus: "",
    religion: "",
    isFatherAlive: "",
    gender: "",
    bloodGroup: "",
    file: null,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [buttonText, setButtonText] = useState("Save");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedStatus = localStorage.getItem("isSaved");
    if (savedStatus === "true") {
      setIsSaved(true);
      setButtonText("Saved");
    }

    const fetchPersonalInfo = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/admission/getStudentDetails", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.saved) {
          setIsSaved(true);
          setButtonText("Saved");
        }

        setPersonalDetails((prev) => ({
          ...prev,
          ...response.data,
        }));
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleInputChange = (e) => {
    if (isSaved) return;
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    if (isSaved) return;
    setPersonalDetails({ ...personalDetails, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Saving...");

    const token = localStorage.getItem("jwt");
    if (!token) return;

    const formData = new FormData();
    for (const key in personalDetails) {
      formData.append(key, personalDetails[key]);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/StudentPersonalDetails",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(true);
      setButtonText("Saved");
      localStorage.setItem("isSaved", "true");
    } catch (error) {
      console.error("Error submitting personal info:", error);
      setButtonText("Save");
    }
  };

  const handleNext = () => {
    navigate("/admission/selectprogram");
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
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
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="admission-container">
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

      <div className="admission-form-wrapper">
        <h2>Personal Information</h2>
        <form className="admission-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={personalDetails.name} onChange={handleInputChange} required readOnly={isSaved} />
          <input type="email" name="email" placeholder="Email" value={personalDetails.email} readOnly />
          <input type="text" name="fathername" placeholder="Father's Name" value={personalDetails.fathername} onChange={handleInputChange} required readOnly={isSaved} />
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={personalDetails.phoneNumber} onChange={handleInputChange} required readOnly={isSaved} />
          <input type="text" name="fatherphoneNumber" placeholder="Father's Phone Number" value={personalDetails.fatherphoneNumber} onChange={handleInputChange} readOnly={isSaved} />
          <input type="text" name="cnic" placeholder="CNIC" value={personalDetails.cnic} onChange={handleInputChange} required readOnly={isSaved} />
          <input type="text" name="fatherCnic" placeholder="Father's CNIC" value={personalDetails.fatherCnic} onChange={handleInputChange} readOnly={isSaved} />
          <input type="date" name="dateOfBirth" value={personalDetails.dateOfBirth} onChange={handleInputChange} required readOnly={isSaved} />
          <input type="text" name="address" placeholder="Address" value={personalDetails.address} onChange={handleInputChange} required readOnly={isSaved} />
          <select name="disability" value={personalDetails.disability} onChange={handleInputChange} required disabled={isSaved}>
            <option value="">Do you have any disability?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="maritalStatus" value={personalDetails.maritalStatus} onChange={handleInputChange} required disabled={isSaved}>
            <option value="">Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>
          <input type="text" name="religion" placeholder="Religion" value={personalDetails.religion} onChange={handleInputChange} required readOnly={isSaved} />
          <select name="isFatherAlive" value={personalDetails.isFatherAlive} onChange={handleInputChange} required disabled={isSaved}>
            <option value="">Is your father alive?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="gender" value={personalDetails.gender} onChange={handleInputChange} required disabled={isSaved}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="bloodGroup" placeholder="Blood Group" value={personalDetails.bloodGroup} onChange={handleInputChange} required readOnly={isSaved} />
          <input type="file" name="file" onChange={handleFileChange} disabled={isSaved} />
          
          <button className="admission-submit-btn" type="submit" disabled={isSaved}>
            {buttonText}
          </button>
         
          <button className="admission-next-btn" type="button" onClick={handleNext}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
