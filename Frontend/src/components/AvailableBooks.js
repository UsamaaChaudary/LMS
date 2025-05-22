import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AvailableBooks.css';
import bookshelfImg from '../assets/images/bookshelf.jpg';

const AvailableBooks = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/books/available-books');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="available-books-dashboard">
            <div className="librarian-sidebar">
                <div className="librarian-sidebar-link" onClick={() => navigate('/librarian-dashboard')}>
                <div style={{ display: "flex", alignItems: "center", padding: "0 5px" }}>
            <span style={{ fontSize: "20px", marginRight: "15px" }}>📊</span>
            <span>Dashboard</span>
          </div>
                </div>
                <div className="librarian-sidebar-link" onClick={() => navigate('/add-book')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>➕</span>
                    <span>Add New Book</span>
                </div>
                <div className="librarian-sidebar-link" onClick={() => navigate('/delete-books')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>🗑️</span>
                    <span>Delete Book</span>
                </div>
               
                <div className="librarian-sidebar-link" onClick={() => navigate('/approvals')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>✅</span>
                    <span>Approvals</span>
                </div>
                <div className="librarian-sidebar-link librarian-logout-link" onClick={handleLogout}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>🚪</span>
                    <span>Logout</span>
                </div>
            </div>
            <div className="available-books-content" style={{ backgroundImage: `url(${bookshelfImg})` }}>
                <div className="librarian-heading-container">
                    <h2 className="librarian-dashboard-heading">Available Books</h2>
                </div>
                <div className="requests-list">
                    {books.length > 0 ? (
                        books.map((book, idx) => (
                            <div key={book._id} className="available-books-request-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                                <div className="card-content">
                                    <div className="card-item">
                                        <span className="label">📖 <b>Book Name:</b></span>
                                        <span className="value">{book.name || 'No Book Name'}</span>
                                    </div>
                                    <div className="card-item">
                                        <span className="label">✍️ <b>Author Name:</b></span>
                                        <span className="value">{book.author || 'No Author Name'}</span>
                                    </div>
                                    <div className="card-item">
                                        <span className="label">📚 <b>Edition:</b></span>
                                        <span className="value">{book.edition || 'N/A'}</span>
                                    </div>
                                    <div className="card-item">
                                        <span className="label">🌐 <b>Language:</b></span>
                                        <span className="value">{book.language || 'N/A'}</span>
                                    </div>
                                    <div className="card-item">
                                        <span className="label">✅ <b>Availability:</b></span>
                                        <span className="value">{book.availability || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-requests-text">No books available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvailableBooks;
