// File: src/components/HeroSection.jsx (ĐÃ SỬA LỖI BO GÓC VÀ CĂN GIỮA)

import React from 'react';
// Đã xóa import { FaSearch } vì không còn dùng Search Bar

// **GIẢ ĐỊNH:** Bạn đã lưu hình ảnh vào thư mục và import nó
import HeroIllustration from '../assets/images/Hero_Section.png';

const HeroSection = () => {
    return (
        // Đã sử dụng min-h-[600px] theo yêu cầu
        <div className="relative w-full h-full min-h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 transition-colors duration-300">

            {/* Đã thêm items-center vào đây để căn giữa toàn bộ nội dung theo chiều dọc của Hero */}
            <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-[60px] items-center">
                
                {/* 1. Cột TRÁI: Hình ảnh minh họa (50%) */}
                {/* Đã xóa rounded-r-xl khỏi đây để bo góc bên trái (nếu cần) hoặc không bo góc */}
                <div className="hidden lg:flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-l-xl">
                    <div className="w-full max-w-md h-full max-h-[450px]">
                        <img
                            src={HeroIllustration}
                            alt="Người tuyển dụng và người tìm việc kết nối"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>

                {/* 2. Cột PHẢI: Nội dung Giới thiệu (50%) */}
                <div className="flex flex-col justify-center text-left py-8"> 
                    
                    {/* Tiêu đề chính */}
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
                        <span className="text-jm-primary">JobMate:</span> Người đồng hành {' '}
                        <span className="text-jm-accent">tin cậy</span> của bạn
                    </h1>

                    {/* Giới thiệu & Slogan */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
                        Nền tảng kết nối freelancer và client với độ chuyên nghiệp và tin cậy cao nhất. Tìm kiếm dự án, phát triển sự nghiệp.
                    </p>

                    {/* Lợi ích nổi bật (Tùy chọn) */}
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-jm-accent mr-1">Phổ biến:</span> React Dev, Python Projects, UI/UX Designer.
                    </div>

                    {/* Thêm nút CTA (Call-to-Action) */}
                    <div className="mt-8">
                        <a href="/browse-jobs" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-jm-primary hover:bg-jm-primary-light transition duration-150">
                            Khám phá công việc ngay!
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HeroSection;