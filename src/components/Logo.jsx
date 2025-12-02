// File: src/components/Logo.jsx

import React from 'react';
// Chỉ import icon logo
import JobMateIcon from '../assets/images/Jobmate_Logo.png'; 

/**
 * Component hiển thị Icon Logo của JobMate. 
 * Mục đích là cung cấp icon để dễ dàng kết hợp với phần text được code riêng.
 * * @param {object} props
 * @param {string} props.className - Các class Tailwind CSS để tùy chỉnh kích thước Icon.
 * @param {boolean} props.asLink - Có bọc trong thẻ <a> dẫn về trang chủ hay không. Mặc định là true.
 */
const LogoIcon = ({ className = 'h-14 w-14', asLink = true }) => {
  const IconElement = (
    <img 
      src={JobMateIcon} 
      alt="JobMate Icon" 
      // Áp dụng class Tailwind cho việc định cỡ. 
      // object-contain đảm bảo hình ảnh không bị méo.
      className={`${className} object-contain transition-opacity duration-300 hover:opacity-90`} 
    />
  );

  if (asLink) {
    return (
      // Bọc trong thẻ <a> dẫn về trang chủ
      <a href="/home" className="inline-block flex-shrink-0" aria-label="Trang chủ JobMate">
        {IconElement}
      </a>
    );
  }

  return IconElement;
};

export default LogoIcon;