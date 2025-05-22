import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';
import profileIcon from '../assets/icons/student-profile-icon.png';  

const AddItem = () => {
    const [itemData, setItemData] = useState({
        name: '',
        amountAvailable: '',
        price: '',
        companyName: '',
        preparationTime: '',
    });
    const [isItemAdded, setIsItemAdded] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileIconRef = useRef(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemData({ ...itemData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/canteen/add-item', itemData);
            setIsItemAdded(true);
            setTimeout(() => {
                setItemData({
                    name: '',
                    amountAvailable: '',
                    price: '',
                    companyName: '',
                    preparationTime: '',
                });
                setIsItemAdded(false);
            }, 1500);
        } catch (error) {
            alert('Error adding item');
        }
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("role");
        localStorage.removeItem("canteenId");
        navigate("/login");
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && profileIconRef.current && !profileIconRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="add-item-container">
            <nav className="canteen-nav">
                <div className="canteen-nav-logo">
                    <h2 className="canteen-heading">Canteen Dashboard</h2>
                </div>

                <div className="profile-dropdown-container">
                    <div className="profile-icon" onClick={handleDropdownToggle} ref={profileIconRef}>
                        <img src={profileIcon} alt="Profile Icon" style={{ width: "70px", height: "70px", cursor: "pointer" }} />
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

            <div className="add-item-form-container">
                <h2 className="canteen-heading">Add New Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="add-item-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Item Name"
                            onChange={handleChange}
                            value={itemData.name}
                            disabled={isItemAdded}
                            required
                        />
                        <input
                            type="number"
                            name="amountAvailable"
                            placeholder="Amount Available"
                            onChange={handleChange}
                            value={itemData.amountAvailable}
                            disabled={isItemAdded}
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            onChange={handleChange}
                            value={itemData.price}
                            disabled={isItemAdded}
                            required
                        />
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            onChange={handleChange}
                            value={itemData.companyName}
                            disabled={isItemAdded}
                            required
                        />
                        <input
                            type="text"
                            name="preparationTime"
                            placeholder="Preparation Time"
                            onChange={handleChange}
                            value={itemData.preparationTime}
                            disabled={isItemAdded}
                            required
                        />

                        <button
                            type="submit"
                            className="add-item-button"
                            disabled={isItemAdded}
                        >
                            {isItemAdded ? "Item Added" : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
