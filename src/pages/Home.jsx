import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import JobList from '../components/JobList';
import JobPage from './JobPage';

const Home = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]); // jobs filtered hoặc tất cả

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Job List */}
      <JobPage />
    </MainLayout>
  );
};

export default Home;
