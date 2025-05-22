import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/images/uni-logo.png";
import "./ForgotPassword.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendResetCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      toast.success("Verification code sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/users/reset-password", {
        email,
        code,
        newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <ToastContainer />
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <img src={logo} alt="University Logo" className="forgot-password-logo" />
          <h2>Forgot Password</h2>

        </div>

        {error && <div className="forgot-password-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={sendResetCode} className="forgot-password-form">
            <input
              className="forgot-password-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="forgot-password-button" disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="forgot-password-form">
            <input
              className="forgot-password-input"
              type="text"
              placeholder="Enter the verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              className="forgot-password-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              className="forgot-password-input"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="forgot-password-button" disabled={loading}>
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
