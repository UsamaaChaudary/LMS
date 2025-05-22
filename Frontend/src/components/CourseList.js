import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import courseAnimation from '../animations/course-animation.json'; 
import { motion } from 'framer-motion';
import './CoursePage.css';

const CoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/courses');
            if (response.data && Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                setMessage('Failed to fetch courses.');
            }
        } catch (error) {
            setMessage('Error fetching courses.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div className="course-page">
            <div className="header">
                <Lottie animationData={courseAnimation} loop={true} className="lottie" />
                <h1 className="heading">📚 Available Courses</h1>
            </div>

            {loading ? (
                <div className="loading-spinner"></div>
            ) : courses.length > 0 ? (
                <div className="course-grid">
                    {courses.map((course) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="course-card"
                        >
                            <h2 className="course-title">{course.title}</h2>
                            <p>🕒 Credit Hours: {course.creditHours}</p>
                            <p>📅 Year: {course.year}</p>
                            <p>🎓 Semester: {course.semester}</p>
                            <p>👨‍🏫 Allocated To: {course.allocatedTo}</p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="no-courses">{message || "No courses available"}</p>
            )}
        </div>
    );
};

export default CoursePage;
