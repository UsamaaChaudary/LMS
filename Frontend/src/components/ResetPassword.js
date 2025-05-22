import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/uni-logo.png";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { newPassword });
      alert("Password updated successfully. You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <img src={logo} alt="University Logo" className="reset-password-logo" />
          <h2>Reset Password</h2>
          <p>Enter your new password below</p>
        </div>
        
        {error && <div className="reset-password-error">{error}</div>}
        
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <div className="reset-password-input-group">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="reset-password-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-password-button"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        
        <div className="reset-password-back">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
