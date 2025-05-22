import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/uni-logo.png";
import "./AdmissionLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdmissionLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.warning("Please enter both email and password.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admission/login",
        credentials
      );

      const { token, student } = response.data;

      if (token) {
        localStorage.setItem("jwt", token);
        localStorage.setItem("admission_student", JSON.stringify(student));

        toast.success("Login successful!", {
          autoClose: 1000,
          onClose: () => navigate("/admission/personalinfo"),
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
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
            onClick={() => navigate("/admission/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="admission-form-box">
        <div className="admission-container">
          <img src={logo} alt="University Logo" className="admission-logo-top" />
          <div className="admission-gap-logo"></div>
          <header>Admission Login</header>
          <form onSubmit={handleSubmit}>
            <div className="admission-input-wrapper">
              <label>Email</label>
              <div className="admission-input-container">
                <input
                  type="email"
                  name="email"
                  placeholder="@ Enter Your Email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admission-input-wrapper">
              <label>Password</label>
              <div className="admission-input-container">
                <input
                  type="password"
                  name="password"
                  placeholder="🔒 Enter Your Password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admission-gap-password"></div>
            <button type="submit" className="admission-submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="admission-top">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="admission-top">
            <span>
              Don't have an account? <Link to="/admission/signup">Register</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionLogin;
