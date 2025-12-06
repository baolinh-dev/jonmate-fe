// File: src/components/Header.jsx (Phiên bản Đã sửa)

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom'; // 💡 IMPORT useNavigate
import { useAuth } from '../context/AuthContext';
import LogoIcon from './Logo';

// --- Component Logo đầy đủ (Icon + Text) ---
const FullLogo = () => (
    <NavLink to="/home" className="flex items-center space-x-1" aria-label="Trang chủ JobMate">
        {/* Tích hợp Icon Logo h-8 w-8 */}
        <LogoIcon className="h-8 w-8" asLink={false} />
        <span className="text-xl font-extrabold tracking-tight dark:text-gray-100">
            <span className="text-jm-primary">Job</span>
            <span className="text-jm-accent">Mate</span>
        </span>
    </NavLink>
);

/**
 * Header: Thanh điều hướng trên cùng, tích hợp Mobile Menu Toggle và Profile Dropdown.
 * @param {object} props
 * @param {function} props.onMenuToggle - Hàm để bật/tắt Sidebar (được truyền từ MainLayout).
 */
const Header = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    // 💡 KHỞI TẠO HOOK useNavigate
    const navigate = useNavigate(); 
    
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State cho menu hồ sơ

    // Các liên kết chính hiển thị trên Desktop
    const navLinks = [
        { name: 'Tất cả công việc', path: '/jobs', roles: ['freelancer', 'client'] },
        { name: 'Ứng tuyển', path: '/my-applications', roles: ['freelancer'] },
        { name: 'Quản lý Application', path: '/client/application', roles: ['client'] },
    ];

    // 💡 HÀM XỬ LÝ ĐĂNG XUẤT ĐÃ CẬP NHẬT
    const handleLogout = async () => {
        // 1. Gọi hàm logout từ AuthContext (xóa cookie và set user=null)
        await logout(); 
        
        // 2. Đóng menu dropdown
        setIsProfileOpen(false);
        
        // 3. Điều hướng người dùng đến trang Login (hoặc '/' để kích hoạt redirect tới '/login')
        // Chọn '/login' để đảm bảo, hoặc '/' nếu AppRoutes của bạn đang hoạt động tốt.
        navigate('/login'); 
    };
    // 💡 KẾT THÚC HÀM XỬ LÝ ĐĂNG XUẤT

    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* 1. Logo & Menu Toggle (Mobile) */}
                <div className="flex items-center space-x-4">
                    {/* Nút Hamburger: Chỉ hiện trên mobile, dùng để mở Sidebar */}
                    {user && ( // Chỉ hiện Hamburger nếu đã đăng nhập (cần Sidebar)
                        <button
                            onClick={onMenuToggle}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden transition duration-150"
                            aria-label="Toggle navigation menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    )}

                    <FullLogo />
                </div>

                {/* 2. Menu chính (Desktop) */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {user ? (
                        <>
                            {navLinks.map((item) => (
                                // Hiển thị link dựa trên vai trò
                                (item.roles.includes(user.role) || item.roles.includes('all')) && (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 
                                            ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 pb-1' : ''}`
                                        }
                                    >
                                        {item.name}
                                    </NavLink>
                                )
                            ))}

                            {/* Nút Tạo Dự án (Chỉ Client) */}
                            {user.role === 'client' && (
                                <NavLink to="/create-job" className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-150 shadow-md">
                                    Đăng dự án
                                </NavLink>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">Đăng nhập</Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">Đăng ký</Link>
                        </>
                    )}
                </nav>

                {/* 3. Account Actions (Notifications & Profile Dropdown) */}
                {user && (
                    <div className="flex items-center space-x-3">

                        {/* Nút Notifications */}
                        <button className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 rounded-full relative transition duration-150">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.405L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        </button>

                        {/* Profile Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                aria-expanded={isProfileOpen}
                                aria-haspopup="true"
                            >
                                <img
                                    className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-indigo-500 transition duration-150"
                                    src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=4f46e5&color=fff`}
                                    alt={user.name || 'Profile'}
                                />
                            </button>

                            {/* Dropdown Content */}
                            {isProfileOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-1 border border-gray-200 dark:border-gray-600"
                                    onMouseLeave={() => setIsProfileOpen(false)} // UX tốt hơn
                                >
                                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <NavLink to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        Hồ sơ cá nhân
                                    </NavLink>
                                    <button
                                        // 💡 SỬ DỤNG HÀM XỬ LÝ ĐĂNG XUẤT MỚI
                                        onClick={handleLogout} 
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 border-t border-gray-100 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-gray-600 transition duration-150"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;