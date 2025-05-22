import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/uni-logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdmissionSignup = () => {
  const [formData, setFormData] = useState({
    cnic: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/admission/signup", formData);
      toast.success("Student admitted successfully!", {
        autoClose: 1500,
        onClose: () => navigate("/admission/login"),
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Admission failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admission-wrapper">
      <ToastContainer position="top-center" />

      <nav className="admission-nav">
        <div className="admission-nav-logo">
          <img src={logo} alt="University Logo" className="admission-logo" />
          <p>University of Education, Attock Campus</p>
        </div>

        <div className="admission-nav-button">
          <button
            className="admission-white-btn"
            onClick={() => navigate("/admission/login")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="admission-form-box">
        <div className="admission-container">
          <img src={logo} alt="University Logo" className="admission-logo-top" />
          <header>Student Admission</header>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="cnic"
              placeholder="CNIC (e.g. 12345-6789012-3)"
              value={formData.cnic}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="@ Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="📞 Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <button type="submit" className="admission-submit" disabled={loading}>
              {loading ? "Submitting..." : "Sign Up"}
            </button>
          </form>
          <div className="admission-top">
            <span>
              Already registered? <Link to="/admission/login">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionSignup;
