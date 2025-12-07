// File: src/pages/Login.jsx (hoặc tương tự)

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
// 1. IMPORT LogoIcon vào đây
import LogoIcon from '../components/Logo'; // Giả định đường dẫn là đúng

const LoginContent = () => {
    // ... (Giữ nguyên logic useState, useCallback, handleSubmit)
    const { loadUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) {
            setError('');
        }
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (isLoading) return; 
        
        setIsLoading(true);
        setError(''); 

        try {
            await api.post('/users/login', formData);
            await loadUser();
            navigate('/home'); 
        } catch (err) {
            console.error('Login Error:', err); 
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại Email và Mật khẩu.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, loadUser, navigate, isLoading]); 

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md border-t-4 border-indigo-600 transform hover:scale-[1.01] transition duration-300"
        >
            <div className="text-center"> 
                <LogoIcon className="mx-auto h-12 w-12 text-indigo-600" asLink={false} />
            </div>
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Chào mừng trở lại 👋
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Đăng nhập để tiếp tục.
                </p>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
                <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm font-medium" role="alert">
                    {error}
                </p>
            )}

            {/* Input Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                    required
                    disabled={isLoading}
                />
            </div>

            {/* Input Password */}
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
                    required
                    disabled={isLoading}
                />
            </div>
            
            {/* Nút Login */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 
                    ${isLoading 
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.01]'
                    }`}
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    'Đăng nhập'
                )}
            </button>

            {/* Thêm link đăng ký */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Chưa có tài khoản? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Đăng ký ngay</a>
                </p>
            </div>
        </form>
    );
};

// Component chính bao bọc Layout và Content
const Login = () => {
    return (
        <AuthLayout>
            <LoginContent />
        </AuthLayout>
    );
};

export default Login;