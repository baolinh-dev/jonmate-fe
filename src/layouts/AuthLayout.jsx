import React, { memo } from 'react'; // 1. Sử dụng memo

// 2. Định nghĩa PropTypes để đảm bảo kiểu dữ liệu
// import PropTypes from 'prop-types'; 

/**
 * AuthLayout: Component Layout chung cho các trang xác thực (Login, Register, Forgot Password).
 * Thiết kế để căn giữa nội dung form và cung cấp background nhẹ nhàng, dễ chịu.
 * * @param {object} props
 * @param {React.ReactNode} props.children - Nội dung chính (thường là form).
 */
const AuthLayout = ({ children }) => {
  return (
    // Nền: Dùng gradient nhẹ nhàng (hoặc một màu cố định) để đỡ nhàm chán hơn bg-gray-50 trơn.
    // Thêm overflow-y-auto để đảm bảo cuộn được trên thiết bị nhỏ.
    <div className="flex flex-col items-center justify-center min-h-screen 
                    bg-gray-100 dark:bg-gray-900 overflow-y-auto p-4 sm:p-6 transition-colors duration-300">
      
      {/* Container Chính (Card/Box) */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg 
                      p-0 sm:p-4 lg:p-8 
                      bg-white dark:bg-gray-800 
                      rounded-xl shadow-2xl dark:shadow-2xl-dark 
                      my-8"> {/* Thêm margin y để nó không bị dính vào mép trên/dưới */}
        
        {/* Nội dung Auth Form */}
        {children}
        
      </div>

      {/* 3. Thêm Footer/Branding nhỏ cho tính chuyên nghiệp */}
      <footer className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
      </footer>
    </div>
  );
};

// 1. Tối ưu hiệu suất: HOC memo
export default memo(AuthLayout);
