import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApprovalsPage.css"; 
import backgroundImage from "../assets/images/bookshelf.jpg";

const ApprovalsPage = () => {
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

      fetchRequests();
    } catch (error) {
      alert("Failed to update request status");
      console.error("Error updating request status:", error);
    }
  };

  return (
    <div
      className="approvals-page-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="approvals-page-container">
        <h1 className="approvals-page-heading">📋 Approvals</h1>

        {loading ? (
          <div className="loader">Loading...</div>
        ) : requests.length > 0 ? (
          <div className="requests-list">
            {requests.map((item) => (
              <div key={item._id} className="request-card">
                <p><span className="label">📖 Book Name:</span> {item.bookName || "Unknown"}</p>
                <p><span className="label">✍️ Author:</span> {item.authorName || "Unknown"}</p>
                <p><span className="label">👤 Requested By:</span> {item.studentName || "Unknown"}</p>
                <p><span className="label">📅 Date:</span> {new Date(item.dateOfRequest).toLocaleDateString()}</p>
                <p><span className="label">📌 Status:</span> 
                  <span className={`status-text ${item.status.toLowerCase().replace(" ", "-")}`}>
                    {item.status}
                  </span>
                </p>

                {item.status === "Request Submitted" && (
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
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-requests-text">No pending approvals.</p>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;
