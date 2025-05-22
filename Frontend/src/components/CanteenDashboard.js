import React, { useState, useEffect, useRef } from 'react';
import './CanteenDashboard.css';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/icons/student-profile-icon.png';
import bg1 from '../assets/images/canteen-background1.jpg';
import bg2 from '../assets/images/canteen-background2.png';
import bg3 from '../assets/images/canteen-background3.jpg';
import bg4 from '../assets/images/canteen-background4.jpg';
import bg5 from '../assets/images/canteen-background5.jpg';

const CanteenDashboard = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [bg1, bg2, bg3, bg4, bg5];

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        localStorage.removeItem("canteenId");
        navigate("/login");
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && profileIconRef.current && !profileIconRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 8000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        document.querySelector('.canteen-dashboard-container').style.backgroundImage = `url(${images[currentImageIndex]})`;
    }, [currentImageIndex]);

    const dropdownRef = useRef(null);
    const profileIconRef = useRef(null);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="canteen-dashboard-container">
            <nav className="canteen-nav">
                <div className="canteen-nav-logo">
                    <h2 className="canteen-heading">Canteen Dashboard</h2>
                </div>
                <div className="profile-dropdown-container">
                    <div className="profile-icon" onClick={handleDropdownToggle} ref={profileIconRef}>
                        <img src={profileIcon} alt="Profile Icon" style={{ width: "70px", height: "70px" }} />
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                            <button onClick={() => navigate('/add-item')}>Add Item</button>
                            <button onClick={() => navigate('/delete-item')}>Delete Item</button>
                            <button onClick={() => navigate('/item-list')}>Available Items</button>
                            <button onClick={() => navigate('/new-orders')}>New Orders</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </nav>

            <footer className="footer">
                <div className="footer-text left-corner">
                    University of Education, Attock Campus
                </div>
                
            </footer>
        </div>
    );
};

export default CanteenDashboard;  
