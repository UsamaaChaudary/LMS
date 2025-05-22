import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import "./Results.css";
import resultAnimation from "../animations/result-animation.json";
import assignmentLogo from "../assets/icons/assignment-logo.png";
import bookLogo from "../assets/icons/book-logo.png";
import canteenLogo from "../assets/icons/order-food-logo.png";
import checkedLogo from "../assets/icons/checked.png";
import logOutLogo from "../assets/icons/loggout.png";
import submitFee from "../assets/icons/fee-logo.png";
import coursesLogo from "../assets/icons/courses-logo.png";

const Results = () => {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          setError("User data not found. Please login again.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const studentName = user.name;

        if (!studentName) {
          setError("Student name not found in user data.");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:5000/api/results/student-results`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { studentName },
          }
        );

        if (response.data && response.data.length > 0) {
          setResultData(response.data);
        } else {
          setError("No results found for your account.");
        }
      } catch (err) {
        setError("Error fetching results. Please try again later.");
        console.error("Fetch Results Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="results-loading">Loading...</div>;
  if (error) return <div className="results-error">{error}</div>;

  return (
    <div className="results-page">
      <div className="results-sidebar">
        <div className="results-nav-link" onClick={() => navigate('/student-dashboard')}>
          <div className="results-nav-text" style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={{ fontSize: "24px", marginRight: "15px" , marginTop: "-10px" }}>📊</span>
          <span style={{ fontSize: "14px", position: "relative", top: "-1px" }}>Dashboard</span>
          </div>
        </div>

        <div className="results-nav-link" onClick={() => navigate('/upload-assignment')}>
          <img
            src={assignmentLogo}
            alt="assignment logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="results-nav-text">Assignment Upload</div>
        </div>

        <div className="results-nav-link" onClick={() => navigate('/request-book')}>
          <img
            src={bookLogo}
            alt="book logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="results-nav-text">Request Book</div>
        </div>

        <div className="results-nav-link" onClick={() => navigate('/order-food')}>
          <img
            src={canteenLogo}
            alt="canteen logo"
            style={{ width: "50px", height: "30px", marginLeft: -10 }}
          />
          <div className="results-nav-text" style={{ marginLeft: -10 }}>Order Food</div>
        </div>

        <div className="results-nav-link" onClick={() => navigate('/my-approvals')}>
          <img
            src={checkedLogo}
            alt="checked logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="results-nav-text">My Approvals</div>
        </div>

        <div className="results-nav-link" onClick={() => navigate('/submit-fee')}>
          <img
            src={submitFee}
            alt="fee submit logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="results-nav-text">Fee Submit</div>
        </div>

        <div className="results-nav-link" onClick={() => navigate('/courses')}>
          <img
            src={coursesLogo}
            alt="courses logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="results-nav-text">Courses</div>
        </div>

        <div className="results-nav-link" onClick={handleLogout}>
          <img
            src={logOutLogo}
            alt="logout logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="results-nav-text">Logout</div>
        </div>
      </div>

      <div className="results-content">
        <div className="results-container">
          <Lottie
            animationData={resultAnimation}
            loop
            autoplay
            className="results-animation"
          />
          
          
          {resultData ? (
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>BSF ID</th>
                    <th>Subject</th>
                    <th>Obtained Marks</th>
                    <th>Total Marks</th>
                    <th>GPA</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((result, index) => (
                    <tr key={index}>
                      <td>{result.studentName}</td>
                      <td>{result.bsfId}</td>
                      <td>{result.subject}</td>
                      <td>{result.obtainedMarks}</td>
                      <td>{result.totalMarks}</td>
                      <td>{result.gpa}</td>
                      <td>{new Date(result.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="results-empty">No results available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
