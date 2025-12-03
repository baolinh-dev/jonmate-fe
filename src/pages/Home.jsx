// File: src/pages/Home.jsx (ĐÃ CẬP NHẬT)

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import HeroSection from '../components/HeroSection'; // 1. Import HeroSection
import JobPage from './JobPage'; // Giả định JobPage là nơi hiển thị danh sách
import ReusableHeading from '../components/ReusableHeading';
import CategorySection from '../components/CategorySection';

const Home = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]); 

  return (
    <MainLayout>
        
      {/* 2. Đặt Hero Section ở đây */}
      <HeroSection />

      <CategorySection />
      <JobPage /> 
      
    </MainLayout>
  );
};

export default Home;