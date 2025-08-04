import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    // Ambil user dari localStorage
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute
