import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/icons/student-profile-icon.png';
import './NewOrders.css';

const NewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileIconRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/canteen/new-orders');
                console.log('Fetched Orders:', response.data);
                setOrders(response.data);
            } catch (error) {
                alert('Error fetching orders: ' + (error.response?.data?.message || error.message));
            }
        };
        fetchOrders();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('canteenJwt');
        localStorage.removeItem('role');
        localStorage.removeItem('canteenId');
        navigate('/login');
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                profileIconRef.current &&
                !profileIconRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="new-orders-container">
            
            <nav className="canteen-nav">
                <div className="canteen-nav-logo">
                    <h2 className="canteen-heading">Canteen Dashboard</h2>
                </div>

                <div className="profile-dropdown-container">
                    <div
                        className="profile-icon"
                        onClick={handleDropdownToggle}
                        ref={profileIconRef}
                    >
                        <img
                            src={profileIcon}
                            alt="Profile Icon"
                            style={{ width: '70px', height: '70px' }}
                        />
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

            <div className="new-orders-content">
                <h2>New Orders</h2>
                {orders.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Item</th>
                                <th>Amount</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.studentName || 'N/A'}</td>
                                    <td>{order.department || 'N/A'}</td>
                                    <td>{order.semester || 'N/A'}</td>
                                    <td>{order.item?.name || 'N/A'}</td> 
                                    <td>{order.amount || 'N/A'}</td>
                                    <td>{order.location || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No new orders available</p>
                )}
            </div>
        </div>
    );
};

export default NewOrders;
