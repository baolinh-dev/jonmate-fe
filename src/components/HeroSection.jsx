// File: src/components/HeroSection.jsx (ĐÃ SỬA LỖI MARKDOWN VÀ HOÀN THIỆN)

import React from 'react';
import { FaRocket, FaShieldAlt } from 'react-icons/fa'; // Icons cho lợi ích nổi bật

// **GIẢ ĐỊNH:** Bạn đã lưu hình ảnh vào thư mục và import nó
import HeroIllustration from '../assets/images/Hero_Section.png';

const HeroSection = () => {
    return (
        // Container chính: min-height, bo góc, shadow và transition
        <div className="relative w-full h-full min-h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 transition-colors duration-300">

            {/* Layout Grid: 2 cột trên màn hình lớn, căn giữa nội dung */}
            <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-[60px] items-center">
                
                {/* 1. Cột TRÁI: Hình ảnh minh họa (50%) - Ẩn trên màn hình nhỏ */}
                <div className="hidden lg:flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-l-xl">
                    <div className="w-full max-w-md h-full max-h-[450px]">
                        <img
                            src={HeroIllustration}
                            alt="Người tuyển dụng và người tìm việc kết nối"
                            // Đảm bảo hình ảnh được scale đúng cách
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>

                {/* 2. Cột PHẢI: Nội dung Giới thiệu (50%) */}
                <div className="flex flex-col justify-center text-left py-8"> 
                    
                    {/* Tiêu đề chính - Đã sửa lỗi Markdown bằng cách dùng <strong> và class Tailwind */}
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight mb-4">
                        <span className="text-jm-primary">JobMate:</span> Nền tảng <br className="hidden md:block" /> 
                        <strong className="font-extrabold">Freelancer</strong> thế hệ mới 
                        <br />
                        <span className="text-jm-accent">Kết nối</span> với 
                        <strong className="font-extrabold"> Minh Bạch</strong> và 
                        <strong className="font-extrabold"> Bảo Mật</strong>
                    </h1>

                    {/* Giới thiệu & Slogan - Nhấn mạnh lợi ích Blockchain */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
                        Tận dụng công nghệ <span className="font-semibold text-jm-primary">Blockchain</span> để đảm bảo 
                        <span className="font-semibold"> Hợp đồng thông minh</span>, 
                        <span className="font-semibold"> Thanh toán an toàn</span> và xây dựng 
                        <span className="font-semibold"> Hồ sơ chuyên môn không thể giả mạo</span>.
                    </p>

                    {/* Danh sách Lợi ích nổi bật (Sử dụng Icons) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <p className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                            <FaShieldAlt className="text-jm-primary mr-2" /> Hợp đồng Thông minh An toàn
                        </p>
                        <p className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                            <FaRocket className="text-jm-primary mr-2" /> Hồ sơ Chuyên môn trên Chuỗi (D-ID)
                        </p>
                    </div>

                    {/* Thêm nút CTA (Call-to-Action) - Tăng cường sự thu hút */}
                    <div className="mt-4">
                        <a href="/jobs" className="inline-flex items-center justify-center px-10 py-3 border border-transparent text-base font-medium rounded-lg shadow-xl text-white bg-jm-accent hover:bg-jm-accent-dark transition duration-150 transform hover:scale-[1.02]">
                            Đăng ký ngay - Nhận dự án Blockchain!
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HeroSection;