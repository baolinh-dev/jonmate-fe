import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const LoginContent = () => {
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/login', { email, password });
      await loadUser();
      navigate('/home'); // redirect sau khi login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
};

const Login = () => {
  return (
    <AuthLayout>
      <LoginContent />
    </AuthLayout>
  );
};

export default Login;
