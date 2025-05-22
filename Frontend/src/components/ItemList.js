import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profileIcon from '../assets/icons/student-profile-icon.png';
import './ItemList.css';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileIconRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/canteen/items');
                setItems(response.data);
            } catch (error) {
                alert('Error fetching items');
            }
        };
        fetchItems();
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
        <div className="item-list-container">
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

            <div className="item-list-content">
                <h2>Available Items</h2>
                <div className="item-list-table-container">
                    <table className="item-list-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Amount Available</th>
                                <th>Company Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.amountAvailable}</td>
                                    <td>{item.companyName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ItemList;
