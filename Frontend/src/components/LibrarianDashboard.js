import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LibrarianDashboard.css';
import axios from 'axios';

const LibrarianDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("Authorization token not found");
                return;
            }

            const response = await axios.get("http://localhost:5000/api/requests/all-requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched requests:", response.data); // Debug log
            setRequests(response.data);
        } catch (error) {
            alert("Failed to fetch requests");
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("Authorization token not found");
                return;
            }

            await axios.post(
                "http://localhost:5000/api/requests/updateRequestStatus",
                { requestId, status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(`Request ${newStatus}`);
            fetchRequests();
        } catch (error) {
            alert("Failed to update request status");
            console.error("Error updating request status:", error);
        }
    };

    const handleNavigate = (page) => {
        navigate(page);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="librarian-dashboard">
            <div className="librarian-sidebar">
                <div className="librarian-sidebar-link" onClick={() => handleNavigate('/available-books')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>📚</span>
                    <span>Available Books</span>
                </div>
                <div className="librarian-sidebar-link" onClick={() => handleNavigate('/add-book')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>➕</span>
                    <span>Add New Book</span>
                </div>
                <div className="librarian-sidebar-link" onClick={() => handleNavigate('/delete-books')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>🗑️</span>
                    <span>Delete Book</span>
                </div>
               
                <div className="librarian-sidebar-link" onClick={() => handleNavigate('/approvals')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>✅</span>
                    <span>Approvals</span>
                </div>
                <div className="librarian-sidebar-link librarian-logout-link" onClick={handleLogout}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>🚪</span>
                    <span>Logout</span>
                </div>
            </div>
            <div className="librarian-dashboard-content">
                <div className="librarian-navbar">
                    <h2 className="librarian-dashboard-heading">Librarian Dashboard</h2>
                </div>
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : (
                    <div className="librarian-requests-list">
                        {requests.filter(item => item.status === "Request Submitted").length > 0 ? (
                            requests
                                .filter(item => item.status === "Request Submitted")
                                .map((item) => (
                                    <div key={item._id} className="librarian-request-card">
                                        <div className="card-content">
                                            <div className="card-item">
                                                <span className="label"><span role="img" aria-label="book">📖</span> <b>Book Name:</b></span>
                                                <span className="value">{item.bookName || "Unknown"}</span>
                                            </div>
                                            <div className="card-item">
                                                <span className="label"><span role="img" aria-label="author">✍️</span> <b>Author:</b></span>
                                                <span className="value">{item.authorName || "Unknown"}</span>
                                            </div>
                                            <div className="card-item">
                                                <span className="label"><span role="img" aria-label="user">🧑‍🎓</span> <b>Requested By:</b></span>
                                                <span className="value">{item.studentName || item.requestedBy || "Unknown"}</span>
                                            </div>
                                            <div className="card-item">
                                                <span className="label"><span role="img" aria-label="calendar">📅</span> <b>Date:</b></span>
                                                <span className="value">{new Date(item.dateOfRequest).toLocaleDateString()}</span>
                                            </div>
                                            <div className="card-item">
                                                <span className="label">📌 Status:</span>
                                                <span className={`status-text ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span>
                                            </div>
                                        </div>
                                        <div className="buttons-container">
                                            <button
                                                className="approve-button"
                                                onClick={() => handleStatusChange(item._id, "Approved")}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="reject-button"
                                                onClick={() => handleStatusChange(item._id, "Rejected")}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="no-requests-text">No pending approvals.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibrarianDashboard;
