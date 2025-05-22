import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddBook.css';
import bookshelfImg from '../assets/images/bookshelf.jpg';
import uploadAnimation from "../animations/course-animation.json";
import Lottie from "lottie-react";

const AddBook = () => {
    const navigate = useNavigate();
    const [bookData, setBookData] = useState({ name: '', author: '', edition: '', language: '', availability: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/books/add-book', bookData);
           
            setBookData({ name: '', author: '', edition: '', language: '', availability: '' });
        } catch (error) {
            console.error('Error adding book:', error);
            
        }
    };

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
                <div className="librarian-sidebar-link" onClick={() => navigate('/available-books')}>
                    <span style={{ fontSize: "24px", marginRight: "12px" }}>📚</span>
                    <span>Available Books</span>
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
                    
                </div>
                <div className="add-book-card">
                    <div style={{ width: 180 , height : 220 , marginTop: "-58px" , marginLeft: "90px" }}>
                        <Lottie animationData={uploadAnimation} loop={true} />
                    </div>
                    <form onSubmit={handleSubmit} className="add-book-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Book Name"
                                value={bookData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="author"
                                placeholder="Author Name"
                                value={bookData.author}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="edition"
                                placeholder="Edition"
                                value={bookData.edition}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="language"
                                placeholder="Language"
                                value={bookData.language}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <select
                                name="availability"
                                value={bookData.availability}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled hidden>
                                    Availability
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <button type="submit" className="add-book-btn">Add Book</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
