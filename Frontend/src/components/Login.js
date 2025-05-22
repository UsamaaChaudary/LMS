import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/uni-logo.png";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
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
        "http://localhost:5000/api/users/login",
        credentials
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful!", {
          onClose: () => {
            switch (user.role) {
              case "student":
                navigate("/student-dashboard");
                break;
              case "teacher":
                navigate("/teacher-dashboard");
                break;
              case "admin":
                navigate("/admin-dashboard");
                break;
              case "librarian":
                navigate("/librarian-dashboard");
                break;
              case "canteen-person":
                navigate("/canteen-dashboard");
                break;
              default:
                navigate("/login");
            }
          },
          autoClose: 1000,
        });
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer position="top-center" />

      <nav className="login-nav">
        <div className="login-nav-logo">
          <img src={logo} alt="University Logo" className="login-logo" />
          <p>University of Education, Attock Campus</p>
        </div>
       
        <div className="login-nav-button">
          <button className="login-white-btn" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      </nav>

      <div className="login-form-box">
        <div className="login-container">
          <img src={logo} alt="University Logo" className="login-logo-top" />
          <div className="gap-after-logo"></div>
          <header>Login</header>
          <form onSubmit={handleSubmit}>
            <div className="login-input-wrapper">
              <label>Email</label>
              <div className="login-input-container">
                <input
                  type="email"
                  name="email"
                  placeholder="@ Enter Your Email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="login-input-wrapper">
              <label>Password</label>
              <div className="login-input-container">
                <input
                  type="password"
                  name="password"
                  placeholder="🔒 Enter Your Password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="gap-after-password"></div>
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="login-top">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="login-top">
            <span>
              Don't have an account? <Link to="/register">Register</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
