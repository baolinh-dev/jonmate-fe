import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>;

    if (!user) return <Navigate to="/login" />; // redirect nếu chưa login

    return children; // render component nếu đã login
};

export default PrivateRoute;
