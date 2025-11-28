import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const HomeContent = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to JobMate</h1>
      <p className="text-lg mb-4">Hello, {user.name}! You are logged in as {user.role}</p>

      <div className="flex space-x-4">
        {user.role === 'client' && (
          <Link
            to="/create-job"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Create Job
          </Link>
        )}
        <Link
          to="/jobs"
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Browse Jobs
        </Link>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

const Home = () => {
  return (
    <MainLayout>
      <HomeContent />
    </MainLayout>
  );
};

export default Home;
