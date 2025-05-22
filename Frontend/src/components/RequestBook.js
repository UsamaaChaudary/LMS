import React, { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "lottie-react"; 
import { useNavigate } from "react-router-dom";
import "./RequestBook.css";
import uploadAnimation from "../animations/upload-animation.json"; 
import assignmentLogo from "../assets/icons/assignment-logo.png";
import canteenLogo from "../assets/icons/order-food-logo.png";
import checkedLogo from "../assets/icons/checked.png";
import resultLogo from "../assets/icons/result-logo.png";
import logOutLogo from "../assets/icons/loggout.png";
import submitFee from "../assets/icons/fee-logo.png";
import coursesLogo from "../assets/icons/courses-logo.png";

const RequestBook = ({ email = "", bsfId = "", studentName = "" }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isBookSelected, setIsBookSelected] = useState(false);
  const [formData, setFormData] = useState({
    studentName,
    email,
    bsfId,
    daysRequested: "",
    book: "",
  });

  useEffect(() => {
    fetchBooks();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setFormData(prevData => ({
          ...prevData,
          studentName: parsedUser.name || prevData.studentName,
          email: parsedUser.email || prevData.email,
          bsfId: parsedUser.bsfId || prevData.bsfId,
        }));
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/books/available-books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "book" && value !== "") {
      setIsBookSelected(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.book || !formData.daysRequested) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const selectedBook = books.find((book) => book._id === formData.book);
      if (!selectedBook) {
        alert("Please select a valid book.");
        return;
      }

      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }

      const requestData = {
        ...formData,
        bookName: selectedBook.name,
        authorName: selectedBook.author,
      };

      await axios.post(
        "http://localhost:5000/api/requests/add-request",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const studentName = formData.studentName;
      const email = formData.email;
      setFormData({
        studentName,
        email,
        bsfId: "",
        daysRequested: "",
        book: "",
      });
      setIsBookSelected(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="request-book-page">
      <div className="dashboardSidebar">
      <div className="sidebarLink" onClick={() => navigate("/student-dashboard")}>
          <div className="sidebarText" style={{ display: "flex", alignItems: "flex-start" }}>
            <span style={{ fontSize: "24px", marginRight: "15px" , marginTop: "-10px" }}>📊</span>
            <span style={{ fontSize: "14px", position: "relative", top: "-1px" }}>Dashboard</span>
          </div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/upload-assignment")}>
          <img
            src={assignmentLogo}
            alt="assignment logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Assignment Upload</div>
        </div>

       

        <div className="sidebarLink" onClick={() => navigate("/order-food")}>
          <img
            src={canteenLogo}
            alt="canteen logo"
            style={{ width: "50px", height: "30px", marginLeft: -10 }}
          />
          <div className="sidebarText" style={{ marginLeft: -10 }}>Order Food</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/my-approvals")}>
          <img
            src={checkedLogo}
            alt="checked logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">My Approvals</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/results")}>
          <img
            src={resultLogo}
            alt="result logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Result</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/submit-fee")}>
          <img
            src={submitFee}
            alt="fee submit logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Fee Submit</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/courses")}>
          <img
            src={coursesLogo}
            alt="courses logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Courses</div>
        </div>

        <div className="sidebarLink" onClick={handleLogout}>
          <img
            src={logOutLogo}
            alt="logout logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Logout</div>
        </div>
      </div>

      <div className="request-book-background">
        <div className="request-book-container">
          <Lottie
            autoplay
            loop
            animationData={uploadAnimation}
            speed={1.5}
            className="request-book-animation"
          />
         
          <form onSubmit={handleSubmit} className="request-book-form">
            <div className="form-group">
              <input
                type="text"
                name="studentName"
                placeholder="Student Name"
                value={formData.studentName}
                disabled
                className="request-book-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                disabled
                className="request-book-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="bsfId"
                placeholder="BSF ID"
                value={formData.bsfId}
                onChange={handleChange}
                className="request-book-input"
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="daysRequested"
                placeholder="Number of Days"
                value={formData.daysRequested}
                onChange={handleChange}
                className="request-book-input"
              />
            </div>
            <div className="form-group">
              <select
                name="book"
                value={formData.book}
                onChange={handleChange}
                className="request-book-input"
              >
                <option value="">Select Book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {`${book.name} by ${book.author}`}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="request-book-submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestBook;
