import React, { useState } from 'react';
import axios from 'axios';
import './FeeConfirmation.css';

const FeeConfirmation = () => {
    const [bankAccount, setBankAccount] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [screenshot, setScreenshot] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('userId', localStorage.getItem('userId'));
        formData.append('bankAccount', bankAccount);
        formData.append('accountHolderName', accountHolderName);
        formData.append('paymentDate', paymentDate);
        if (screenshot) formData.append('screenshot', screenshot);

        try {
            await axios.post('http://localhost:5000/api/submit-fee', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Fee details submitted successfully!');
        } catch (error) {
            console.error('Error submitting fee details:', error);
            alert('Failed to submit fee details. Please try again.');
        }
    };

    return (
        <form className="fee-form" onSubmit={handleSubmit}>
            <h2>Fee Confirmation</h2>
            <input
                type="text"
                placeholder="Bank Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Account Holder Name"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                required
            />
            <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
            />
            <input
                type="file"
                onChange={(e) => setScreenshot(e.target.files[0])}
                accept="image/*"
            />
            <button
            className='fee-submit-btn'
             type="submit">Submit Fee Details</button>
        </form>
    );
};

export default FeeConfirmation;
