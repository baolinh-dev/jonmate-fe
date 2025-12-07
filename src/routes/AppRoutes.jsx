// src/routes/AppRoutes.js (Đã sửa)

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
import FreelancerApplications from '../pages/FreelancerApplications';

const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Đang tải...</div>;

    return (
        <Router>
            <Routes>

                {/* SỬA ĐỔI: Route mặc định "/" */}
                {/* Nếu đã đăng nhập: Chuyển về /home. 
                    Nếu chưa đăng nhập (đã đăng xuất): Chuyển về /login. */}
                <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />

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
                        <PrivateRoute requiredRole="client"> {/* Có thể thêm kiểm tra vai trò tại đây */}
                            <CreateJob />
                        </PrivateRoute>
                    }
                />

                {/* Client Applications */}
                <Route
                    path="/client/application"
                    element={
                        <PrivateRoute requiredRole="client"> {/* Có thể thêm kiểm tra vai trò tại đây */}
                            <ClientAllApplications />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/my-applications" // Path đã được dùng trong Header
                    element={
                        <PrivateRoute requiredRole="freelancer">
                            <FreelancerApplications />
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