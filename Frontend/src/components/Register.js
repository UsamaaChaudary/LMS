import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/uni-logo.png";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role
    code: "",
  });
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/register",
          formData
        );
        setNotification({
          type: "success",
        });
        setStep(2);
        setFormData({
          ...formData,
          code: "",
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        setNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/verify-code",
          {
            email: formData.email,
            code: formData.code,
          }
        );
        setNotification({
          type: "success",
        });
        navigate("/login");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Verification failed. Please try again.";
        setNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-wrapper">
      <nav className="register-nav">
        <div className="register-nav-logo">
          <img src={logo} alt="University Logo" className="register-logo" />
          <p>University of Education, Attock Campus</p>
        </div>
       
        <div className="register-nav-button">
          <button
            className="register-white-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>
      </nav>

      <div className="register-form-box">
        <div className="register-container">
          <img src={logo} alt="University Logo" className="register-logo-top" />
          <div className="gap-after-logo"></div>
          <header>Register</header>
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="@ Email"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="🔒 Password"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
                <select
                  name="role"
                  onChange={handleChange}
                  value={formData.role}
                  required
                  className="register-select"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                  <option value="canteen-person">Canteen Person</option>
                </select>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="code"
                  placeholder="Enter Verification Code"
                  onChange={handleChange}
                  value={formData.code}
                  required
                />
              </>
            )}
            <button type="submit" className="register-submit">
              {loading
                ? step === 1
                  ? "Registering..."
                  : "Verifying..."
                : step === 1
                ? "Register"
                : "Verify Code"}
            </button>
          </form>
          <div className="register-top">
            <span>
              Already have an account? <Link to="/login">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
