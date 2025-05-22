import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import backgroundImage from '../assets/images/admin2.jpg';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests/all-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching admin requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard" >
 
      <div className="admin-sidebar">
        <button className="admin-sidebar-link" onClick={() => handleNavigate('/upload-news')}>
          <span>📰</span>
          <span>Upload News</span>
        </button>
        <button className="admin-sidebar-link" onClick={() => handleNavigate('/approvals')}>
          <span>✅</span>
          <span>Approvals</span>
        </button>
        <button className="admin-sidebar-link" onClick={() => handleNavigate('/add-student')}>
          <span>🎓</span>
          <span>Add New Student</span>
        </button>
        <button className="admin-sidebar-link" onClick={() => handleNavigate('/add-teacher')}>
          <span>👨‍🏫</span>
          <span>Add New Teacher</span>
        </button>
        <button className="admin-sidebar-link" onClick={() => handleNavigate('/addcourse')}>
          <span>📚</span>
          <span>Allocate Courses</span>
        </button>
        <button className="admin-sidebar-link" onClick={() => handleNavigate('/admission/meritlist')}>
          <span>🏆</span>
          <span>See MeritList</span>
        </button>
        <button className="admin-sidebar-link admin-logout-link" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      <div className="admin-dashboard-content" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '1120px 700px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <div className="admin-heading-container">
          <h2 className="admin-dashboard-heading">Admin Dashboard</h2>
        </div>

        {loading ? (
          <div className="loading-text">Loading requests...</div>
        ) : (
          <div className="admin-request-grid">
            {requests.map((req, index) => (
              <div key={index} className="admin-request-card">
                <p><strong>👤 Requested By:</strong> {req.studentName}</p>
                <p><strong>📧 Email:</strong> {req.email}</p>
                <p><strong>🆔 BSF ID:</strong> {req.bsfId}</p>
                <p><strong>📚 Book Name:</strong> {req.bookName}</p>
                <p><strong>📅 Days Requested:</strong> {req.daysRequested}</p>
                <p><strong>🚦 Request Status:</strong> {req.status || "Pending"}</p>
            
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
