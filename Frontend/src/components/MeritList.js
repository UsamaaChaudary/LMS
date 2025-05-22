import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MeritList.css';

const MeritList = () => {
  const [meritList, setMeritList] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    const fetchMeritList = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get('http://localhost:5000/api/meritList', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeritList(response.data.meritList);
        setWaitingList(response.data.waitingList);
      } catch (error) {
        console.error('Error fetching merit list:', error);
      }
    };

    fetchMeritList();
  }, []);

  const handlePrintChallan = async (id) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get(`http://localhost:5000/api/generateChallan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `challan_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading challan:', error);
    }
  };

  const handleGenerateID = async (student) => {
    const prefix = "bsf2101";
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const generatedID = `${prefix}${randomDigits}`;
  
    

    try {
      const token = localStorage.getItem('jwt');
      if (student.generatedID) {
        alert(`Student already has a generated ID: ${student.generatedID}`);
        return; 
      }
      await axios.put(
        'http://localhost:5000/api/generate-id',
        { userId: student.userId._id, generatedID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      alert(`Generated ID: ${generatedID} has been saved successfully!`);
    } catch (error) {
      console.error('Error updating generated ID:', error);
      alert('Error Generating ID.');
    }
  };
  

  return (
    <div className="merit-list-container">
      <h2>University of Education , Attock Campus</h2>
      
      <div className="merit-table">
        <h3>Merit List</h3>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Merit Percentage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meritList.map((student, index) => (
              <tr key={student._id} className="merit-list">
                <td>{index + 1}</td>
                <td>{student.userId.name}</td>
                <td>{student.userId.email}</td>
                <td>{student.finalMeritPercentage}%</td>
                <td>
                  <button
                    className="challan-btn"
                    onClick={() => handlePrintChallan(student._id)}
                  >
                    Print Challan
                  </button>
                  <button
                    className="generate-id-btn"
                    onClick={() => handleGenerateID(student)}
                  >
                    Generate ID
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Waiting List</h3>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Merit Percentage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {waitingList.map((student, index) => (
              <tr key={student._id} className="waiting-list">
                <td>{index + 1}</td>
                <td>{student.userId.name}</td>
                <td>{student.userId.email}</td>
                <td>{student.finalMeritPercentage ? `${student.finalMeritPercentage}%` : 'N/A'}</td>
                <td>
                  <button
                    className="challan-btn"
                    onClick={() => handlePrintChallan(student._id)}
                  >
                    Print Challan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeritList;
