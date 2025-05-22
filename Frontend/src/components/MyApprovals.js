import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import "./MyApprovals.css";
import uploadAnimation from "../animations/upload-animation.json";
import assignmentLogo from "../assets/icons/assignment-logo.png";
import bookLogo from "../assets/icons/book-logo.png";
import canteenLogo from "../assets/icons/order-food-logo.png";
import resultLogo from "../assets/icons/result-logo.png";
import logOutLogo from "../assets/icons/loggout.png";
import submitFee from "../assets/icons/fee-logo.png";
import coursesLogo from "../assets/icons/courses-logo.png";

const MyApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/requests/my-requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setApprovals(response.data);
      } else {
        setError('No data received from server');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching approvals:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'Failed to fetch approvals'}`);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        return;
      }
      await axios.post(
        'http://localhost:5000/api/requests/updateRequestStatus',
        { requestId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchApprovals();
    } catch (err) {
      setError('Failed to update request status');
    }
  };

    return (
    <div className="my-approvals-page">
      <div className="my-approvals-sidebar">
        <div className="my-approvals-nav-link" onClick={() => navigate('/student-dashboard')}>
          <div className="my-approvals-nav-text" style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={{ fontSize: "24px", marginRight: "15px" , marginTop: "-10px" }}>📊</span>
          <span style={{ fontSize: "14px", position: "relative", top: "-1px" }}>Dashboard</span>
          </div>
        </div>

       
        <div className="my-approvals-nav-link" onClick={() => navigate('/upload-assignment')}>
          <img
            src={assignmentLogo}
            alt="assignment logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="my-approvals-nav-text">Assignment Upload</div>
        </div>

        <div className="my-approvals-nav-link" onClick={() => navigate('/request-book')}>
          <img
            src={bookLogo}
            alt="book logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="my-approvals-nav-text">Request Book</div>
        </div>

        <div className="my-approvals-nav-link" onClick={() => navigate('/order-food')}>
          <img
            src={canteenLogo}
            alt="canteen logo"
            style={{ width: "50px", height: "30px", marginLeft: -10 }}
          />
          <div className="my-approvals-nav-text" style={{ marginLeft: -10 }}>Order Food</div>
        </div>

        <div className="my-approvals-nav-link" onClick={() => navigate('/results')}>
          <img
            src={resultLogo}
            alt="result logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="my-approvals-nav-text">Result</div>
        </div>

        <div className="my-approvals-nav-link" onClick={() => navigate('/submit-fee')}>
          <img
            src={submitFee}
            alt="fee submit logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="my-approvals-nav-text">Fee Submit</div>
        </div>

        <div className="my-approvals-nav-link" onClick={() => navigate('/courses')}>
          <img
            src={coursesLogo}
            alt="courses logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="my-approvals-nav-text">Courses</div>
        </div>

        <div className="my-approvals-nav-link" onClick={handleLogout}>
          <img
            src={logOutLogo}
            alt="logout logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="my-approvals-nav-text">Logout</div>
        </div>
      </div>

      <div className="my-approvals-content">
        <h2 className="my-approvals-heading">My Approvals</h2>
        
        {loading && <p className="my-approvals-loading">Loading...</p>}
        {error && <p className="my-approvals-error">{error}</p>}
        
        {!loading && !error && (
          <div className="my-approvals-list">
            {approvals.length === 0 ? (
              <p className="my-approvals-empty">No approvals found</p>
            ) : (
              approvals.map((approval, index) => (
                <div 
                  key={approval._id} 
                  className="my-approvals-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="my-approvals-item-title">{approval.bookName || approval.type}</h3>
                  <p className="my-approvals-item-status"><strong>Status:</strong> {approval.status}</p>
                  <p className="my-approvals-item-date"><strong>Submitted:</strong> {new Date(approval.createdAt || approval.dateOfRequest).toLocaleDateString()}</p>
                  {approval.comments && <p className="my-approvals-item-comments"><strong>Comments:</strong> {approval.comments}</p>}
                  {approval.authorName && <p className="my-approvals-item-author"><strong>Author:</strong> {approval.authorName}</p>}
                  {approval.daysRequested && <p className="my-approvals-item-days"><strong>Days Requested:</strong> {approval.daysRequested}</p>}
                  {approval.status === "Request Submitted" && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApprovals;
