import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewApplications.css";

const NewApplications = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("jwt"); 
      if (!token) {
        console.error("Authorization token not found");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/requests/all-requests", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem("jwt"); 
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/requests/updateRequestStatus",
        { requestId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  return (
    <div className="new-applications">
      <h2>New Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Requested By</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.bookName}</td>
              <td>{request.authorName}</td>
              <td>{request.studentName}</td>
              <td>{new Date(request.dateOfRequest).toLocaleDateString()}</td>
              <td>
                {request.status === "Request Submitted" && (
                  <>
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleStatusChange(request._id, "Approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleStatusChange(request._id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
                {request.status.includes("Approved") && (
                  <button className="approved-status">{request.status}</button>
                )}
                {request.status.includes("Rejected") && (
                  <button className="rejected-status">{request.status}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewApplications;
