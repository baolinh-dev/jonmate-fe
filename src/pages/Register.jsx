import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const RegisterContent = () => {
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  // 1. Gộp state: Quản lý form data hiệu quả hơn
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer', // Giá trị mặc định
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 2. State Loading

  // Handler chung cho tất cả input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
        setError('');
    }
  };

  // 3. Sử dụng useCallback để memoize hàm handleSubmit
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      // 4. Gửi formData trực tiếp
      await api.post('/users/register', formData); 
      
      // Tự động Login sau khi đăng ký thành công
      await api.post('/users/login', { email: formData.email, password: formData.password }); 
      
      await loadUser();
      navigate('/home'); 
    } catch (err) {
      console.error('Registration Error:', err); 
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, loadUser, navigate, isLoading]);

  return (
    // 5. Cải tiến Tailwind CSS: Áp dụng style Card tương tự Login, nhưng dùng màu xanh lá (Green)
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md border-t-4 border-green-600 transform hover:scale-[1.01] transition duration-300"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Tạo tài khoản mới 🎉
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Bắt đầu hành trình của bạn.
        </p>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Input Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
        <input
          id="name"
          name="name" // Thêm name
          type="text"
          placeholder="Tên của bạn"
          value={formData.name}
          onChange={handleInputChange}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150"
          required
          disabled={isLoading}
        />
      </div>

      {/* Input Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          name="email" // Thêm name
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleInputChange}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150"
          required
          disabled={isLoading}
        />
      </div>

      {/* Input Password */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
        <input
          id="password"
          name="password" // Thêm name
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={handleInputChange}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150"
          required
          disabled={isLoading}
        />
      </div>

      {/* Select Role */}
      <div className="mb-6">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Bạn là ai?</label>
        <select
          id="role"
          name="role" // Thêm name
          value={formData.role}
          onChange={handleInputChange}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150"
          disabled={isLoading}
        >
          <option value="freelancer">Freelancer (Tôi muốn làm việc)</option>
          <option value="client">Client (Tôi muốn thuê người)</option>
        </select>
      </div>
      
      {/* Nút Register */}
      <button
        type="submit"
        disabled={isLoading}
        // 6. Màu nút Green cho Đăng ký (phân biệt với Login - Indigo)
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 
          ${isLoading 
            ? 'bg-green-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 transform hover:scale-[1.01]'
          }`}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Đăng ký tài khoản'
        )}
      </button>

      {/* Link Đăng nhập */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản? <a href="/login" className="font-medium text-green-600 hover:text-green-500">Đăng nhập ngay</a>
        </p>
      </div>
    </form>
  );
};

// Component chính bao bọc Layout và Content
const Register = () => {
    return (
        <AuthLayout>
            <RegisterContent />
        </AuthLayout>
    );
};

export default Register;