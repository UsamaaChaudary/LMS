import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('jwt');
     if (!token) {
        alert("Please Login To Access This Page.");
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
