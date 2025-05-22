import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import "./OrderFood.css";
import foodAnimation from "../animations/food-animation.json"; 

const OrderFood = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [studentData, setStudentData] = useState({
    name: '',
    department: '',
    semester: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/canteen/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
        setError('Error fetching items');
      }
    };

    const fetchUserData = async () => {
      try {
        const userData = await localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setStudentData(prevData => ({
            ...prevData,
            name: parsedUser.name || prevData.name,
            department: parsedUser.department || prevData.department,
            semester: parsedUser.semester || prevData.semester,
          }));
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchItems();
    fetchUserData()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedItemId || !amount || !location || !studentData.name) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/canteen/order', {
        studentName: studentData.name,
        department: studentData.department,
        semester: studentData.semester,
        itemId: selectedItemId,
        amount,
        location,
      });
     
      setAmount('');
      setLocation('');
      setSelectedItemId('');
      const name = studentData.name;
      setStudentData({
        name,
        department: '',
        semester: ''
      });
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Error placing order. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="order-food-page">
      <div className="order-food-background">
        <div className="order-food-container">
          <Lottie
            animationData={foodAnimation}
            loop
            autoplay
            className="order-food-animation"
          />
         

          {error && <p className="order-food-error">{error}</p>}

          <form onSubmit={handleSubmit} className="order-food-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={studentData.name}
                disabled
                className="order-food-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="department"
                placeholder="Enter Department"
                value={studentData.department}
                onChange={handleInputChange}
                className="order-food-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="semester"
                placeholder="Enter Semester"
                value={studentData.semester}
                onChange={handleInputChange}
                className="order-food-input"
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="order-food-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="order-food-input"
              />
            </div>
            <div className="form-group">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="order-food-input"
              >
                <option value="">Select an item</option>
                {items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="order-food-submit">
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderFood;
