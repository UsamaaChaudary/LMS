import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bookshelfImg from "../assets/images/bookshelf.jpg";
import "./DeleteBook.css";

const DeleteBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/books/available-books",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("libraryJwt")}`,
          },
        }
      );
      setBooks(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch books.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/books/delete-books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("libraryJwt")}`,
          },
        }
      );
      alert(response.data.message);
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete book.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="delete-book-dashboard">
      <div className="librarian-sidebar">
        <div
          className="librarian-sidebar-link"
          onClick={() => navigate("/librarian-dashboard")}
        >
          <div
            style={{ display: "flex", alignItems: "center", padding: "0 5px" }}
          >
            <span style={{ fontSize: "20px", marginRight: "15px" }}>📊</span>
            <span>Dashboard</span>
          </div>
        </div>
        <div
          className="librarian-sidebar-link"
          onClick={() => navigate("/available-books")}
        >
          <span style={{ fontSize: "24px", marginRight: "12px" }}>📚</span>
          <span>Available Books</span>
        </div>
        <div
          className="librarian-sidebar-link"
          onClick={() => navigate("/add-book")}
        >
          <span style={{ fontSize: "24px", marginRight: "12px" }}>➕</span>
          <span>Add New Book</span>
        </div>

        <div
          className="librarian-sidebar-link"
          onClick={() => navigate("/approvals")}
        >
          <span style={{ fontSize: "24px", marginRight: "12px" }}>✅</span>
          <span>Approvals</span>
        </div>
        <div
          className="librarian-sidebar-link librarian-logout-link"
          onClick={handleLogout}
        >
          <span style={{ fontSize: "24px", marginRight: "12px" }}>🚪</span>
          <span>Logout</span>
        </div>
      </div>
      <div
        className="delete-book-content"
        style={{ backgroundImage: `url(${bookshelfImg})` }}
      >
        <div className="librarian-heading-container">
          <h2 className="librarian-dashboard-heading">Delete Book</h2>
        </div>
        <div className="delete-book-card">
          <div className="delete-book-table-container">
            <table className="delete-book-table">
              <thead>
                <tr>
                  <th>Book Name</th>
                  <th>Author Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book._id}>
                      <td>{book.name}</td>
                      <td>{book.author}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="delete-book-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No books available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
