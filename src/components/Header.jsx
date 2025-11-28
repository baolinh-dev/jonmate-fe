import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/home">JobMate</Link>
      </div>

      {/* Menu */}
      <nav className="space-x-4">
        {!user && (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/home" className="hover:text-gray-300">Home</Link>
            <Link to="/jobs" className="hover:text-gray-300">Browse Jobs</Link>
            {user.role === 'client' && (
              <Link to="/create-job" className="hover:text-gray-300">Create Job</Link>
            )}
            <button
              onClick={logout}
              className="ml-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
