// File: src/components/Footer.jsx

import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // Năm hiện tại cho bản quyền
    const currentYear = new Date().getFullYear();

    // Các liên kết thường thấy ở Footer
    const footerLinks = [
        { name: 'Về chúng tôi', path: '/about' },
        { name: 'Liên hệ', path: '/contact' },
        { name: 'Điều khoản dịch vụ', path: '/terms' },
        { name: 'Chính sách bảo mật', path: '/privacy' },
    ];

    return (
        // Footer: Sử dụng màu nền tối hơn hoặc đường viền để phân biệt với Content
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* 1. Phần liên kết */}
                <div className="flex justify-center space-x-6 mb-4">
                    {footerLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* 2. Phần Bản quyền và Branding */}
                <div className="text-center text-xs text-gray-500 dark:text-gray-500">
                    &copy; {currentYear} JobMate. Người đồng hành tìm kiếm việc làm. All rights reserved.
                    <p className="mt-1">Designed and Built by Frontend Expert.</p>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);