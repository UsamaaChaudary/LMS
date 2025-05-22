import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddCourseForm.css';
import backgroundImage from '../assets/images/admin2.jpg'; 
import Lottie from 'lottie-react';
import courseAnimation from '../animations/course-animation.json';

const AddCourseForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        creditHours: '',
        year: '',
        semester: '',
        allocatedTo: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, creditHours, year, semester, allocatedTo } = formData;

        if (!title || !creditHours || !year || !semester || !allocatedTo) {
            alert('Please fill all fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/courses/add-course', formData);

            if (response.status === 201) {
                setMessage('Course added successfully!');
                setFormData({ title: '', creditHours: '', year: '', semester: '', allocatedTo: '' });
            } else {
                setMessage(`Failed to add course: ${response.data.error || 'Unknown error'}`);
            }
        } catch (error) {
            setMessage(`An error occurred: ${error.message}`);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="course-admin-dashboard">
            <div className="course-admin-sidebar">
                <button className="course-admin-sidebar-link" onClick={() => navigate("/admin-dashboard")}>
                    <span>📊</span>
                    <span>Dashboard</span>
                </button>
                <button className="course-admin-sidebar-link" onClick={() => handleNavigate('/upload-news')}>
                    <span>📰</span>
                    <span>Upload News</span>
                </button>
                <button className="course-admin-sidebar-link" onClick={() => handleNavigate('/approvals')}>
                    <span>✅</span>
                    <span>Approvals</span>
                </button>
                <button className="course-admin-sidebar-link" onClick={() => handleNavigate('/add-student')}>
                    <span>🎓</span>
                    <span>Add New Student</span>
                </button>
                <button className="course-admin-sidebar-link" onClick={() => handleNavigate('/add-teacher')}>
                    <span>👨‍🏫</span>
                    <span>Add New Teacher</span>
                </button>
                <button className="course-admin-sidebar-link" onClick={() => handleNavigate('/admission/meritlist')}>
                    <span>🏆</span>
                    <span>See MeritList</span>
                </button>
                <button className="course-admin-sidebar-link course-admin-logout-link" onClick={handleLogout}>
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>

            <div className="course-admin-dashboard-content" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '1120px 700px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                <div className="course-form-container">
                    <div className="course-animation-container">
                        <Lottie animationData={courseAnimation} style={{ width: 200, height: 200 }} />
                    </div>
                    
                    {message && <p className="course-message">{message}</p>}
                    <input
                        name="title"
                        placeholder="Course Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="course-input"
                    />
                    <input
                        name="creditHours"
                        type="number"
                        placeholder="Credit Hours"
                        value={formData.creditHours}
                        onChange={handleChange}
                        className="course-input"
                    />
                    <input
                        name="year"
                        type="number"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleChange}
                        className="course-input"
                    />
                    <input
                        name="semester"
                        type="text"
                        placeholder="Semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="course-input"
                    />
                    <input
                        name="allocatedTo"
                        placeholder="Allocated To"
                        value={formData.allocatedTo}
                        onChange={handleChange}
                        className="course-input"
                    />
                    <button className="course-submit-button" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddCourseForm;
