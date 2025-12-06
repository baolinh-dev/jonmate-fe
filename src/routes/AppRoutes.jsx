// src/routes/AppRoutes.js (Đã sửa đổi)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import CreateJob from '../pages/CreateJob';
import JobPage from '../pages/JobPage';
import JobDetail from '../pages/JobDetail';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';
import ClientAllApplications from '../pages/ClientAllApplications';

const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Đang tải...</div>;

    return (
        <Router>
            <Routes>

                {/* Điều hướng mặc định: Nếu chưa đăng nhập thì tới /jobs, nếu đăng nhập thì tới /home */}
                <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/jobs" />} />

                {/* 1. PUBLIC ROUTES (Không cần đăng nhập) */}
                
                {/* Login/Register: Redirect về Home nếu đã đăng nhập */}
                <Route
                    path="/login"
                    element={user ? <Navigate to="/home" /> : <Login />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to="/home" /> : <Register />}
                />
                
                {/* 💡 Job Page (danh sách job): TRUY CẬP CÔNG KHAI */}
                <Route path="/jobs" element={<JobPage />} />

                {/* 💡 Job Detail: TRUY CẬP CÔNG KHAI */}
                <Route path="/jobs/:id" element={<JobDetail />} /> 


                {/* 2. PRIVATE ROUTES (Cần đăng nhập) */}

                {/* Home */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                {/* Create Job */}
                <Route
                    path="/create-job"
                    element={
                        <PrivateRoute>
                            <CreateJob />
                        </PrivateRoute>
                    }
                /> 

                {/* Create Job */}
                <Route
                    path="/client/application"
                    element={
                        <PrivateRoute>
                            <ClientAllApplications />
                        </PrivateRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<div>404 Not Found</div>} />

            </Routes>
        </Router>
    );
};

export default AppRoutes;