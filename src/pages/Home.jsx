// File: src/pages/Home.jsx (ĐÃ CẬP NHẬT)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection'; // 1. Import HeroSection
import JobPage from './JobPage'; // Giả định JobPage là nơi hiển thị danh sách

const Home = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]); 

  return (
    <MainLayout>
        
      {/* 2. Đặt Hero Section ở đây */}
      <HeroSection />

      {/* 3. Tiêu đề cho danh sách công việc */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 mt-8">
          {user ? `Công việc gần đây cho ${user.role}` : 'Các công việc mới nhất'}
      </h2>

      {/* Job List */}
      {/* Lưu ý: JobPage có vẻ là một wrapper. Bạn có thể thay thế bằng JobList nếu muốn */}
      <JobPage /> 
      
    </MainLayout>
  );
};

export default Home;