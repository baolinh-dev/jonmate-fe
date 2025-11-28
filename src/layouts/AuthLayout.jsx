import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
