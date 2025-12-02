// File: src/layouts/MainLayout.jsx (Đã Tối Giản cho Desktop)

import React, { memo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// Sidebar không cần thiết cho layout Desktop đơn giản này

/**
 * MainLayout: Cấu trúc đơn giản (Header, Content, Footer), tối ưu cho Desktop.
 * Đảm bảo Sticky Footer và nội dung chính chiếm hết không gian.
 */
const MainLayout = ({ children }) => {
    return (
        // Cấu trúc flex-col chuẩn cho Sticky Footer
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            
            {/* Header: Cố định ở trên cùng */}
            <Header />
            
            {/* Main Content Area: flex-grow để chiếm hết không gian còn lại */}
            <main className="flex-grow max-w-full p-6 lg:p-10"> {/* Padding lớn hơn cho Desktop */}
                {/* * Container/Card cho nội dung. 
                  * max-w-7xl mx-auto để căn giữa nội dung trong một container có giới hạn chiều rộng, 
                  * là tiêu chuẩn cho thiết kế Desktop Dashboard.
                  */}
                <div className="max-w-7xl mx-auto h-full min-h-[calc(100vh-14rem)]"> 
                    {children}
                </div>
            </main>
            
            {/* Footer: Cố định ở dưới cùng */}
            <Footer />
        </div>
    );
};

export default memo(MainLayout);