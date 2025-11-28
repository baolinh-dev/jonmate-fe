import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; 

  if (!user) return <Navigate to="/login" />; // redirect nếu chưa login

  return children; // render component nếu đã login
};

export default PrivateRoute;
