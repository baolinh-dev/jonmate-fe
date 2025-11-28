import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const RegisterContent = () => {
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('freelancer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', { name, email, password, role });
      await api.post('/users/login', { email, password }); // tự login sau khi register
      await loadUser();
      navigate('/home'); // redirect sau khi register
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
        required
      />
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
        className="border p-2 mb-2 w-full rounded"
        required
      />
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      >
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <button
        type="submit"
        className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600"
      >
        Register
      </button>
    </form>
  );
};

const Register = () => {
  return (
    <AuthLayout>
      <RegisterContent />
    </AuthLayout>
  );
};

export default Register;
