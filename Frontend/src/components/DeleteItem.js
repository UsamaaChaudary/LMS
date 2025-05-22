import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import profileIcon from "../assets/icons/student-profile-icon.png";
import "./DeleteItem.css";

const DeleteItem = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

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
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/canteen/items",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("canteenJwt")}`,
          },
        }
      );
      setItems(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch items.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/canteen/delete-item/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("canteenJwt")}`,
          },
        }
      );
      fetchItems();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete item.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("canteenJwt");
    localStorage.removeItem("role");
    localStorage.removeItem("canteenId");
    navigate("/login");
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="delete-item-container">
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
              style={{ width: "70px", height: "70px" }}
            />
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              <button onClick={() => navigate("/add-item")}>Add Item</button>
              <button onClick={() => navigate("/delete-item")}>Delete Item</button>
              <button onClick={() => navigate("/item-list")}>Available Items</button>
              <button onClick={() => navigate("/new-orders")}>New Orders</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div className="delete-item-content">
        <h2>Delete Existing Item</h2>

        <div className="delete-item-table-container">
          <table className="delete-item-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount Available</th>
                <th>Price</th>
                <th>Company Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.amountAvailable}</td>
                    <td>PKR{item.price.toFixed(2)}</td>
                    <td>{item.companyName}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="delete-button delete"
                      >
                        
                        <div className="trash">
                          <div className="top">
                            <div className="paper"></div>
                          </div>
                          <div className="box"></div>
                          <div className="check">
                            <svg viewBox="0 0 8 6">
                              <polyline points="1 3.5 3 5.5 7 1.5"></polyline>
                            </svg>
                          </div>
                        </div>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No items available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeleteItem;
