import React from 'react';
import Logo from './Logo'; // Vẫn import Logo

const ReusableHeading = ({ title }) => {
  return (
    // Các lớp Tailwind cho việc căn giữa:
    // flex (sử dụng flexbox)
    // flex-col (xếp các item theo cột: Logo trên, Title dưới)
    // items-center (Căn giữa theo chiều ngang - trục chính khi dùng flex-col)
    // p-6 (padding)
    // mb-8 (margin bottom lớn hơn)
    <div className="flex flex-col items-center p-6 mb-8">
      
      {/* 1. Component Logo ở trên */}
      <Logo />
      
      {/* 2. Title ở dưới, nhận từ props */}
      {/* Các lớp Tailwind: text-3xl (font size), font-semibold (font weight), text-gray-700 (màu chữ), mt-2 (margin top) */}
      <h2 className="text-3xl font-semibold text-gray-700 mt-2">{title}</h2>
    </div>
  );
};

export default ReusableHeading;