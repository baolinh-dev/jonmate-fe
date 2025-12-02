import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [skills, setSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title || !description || !category) {
        setError('Title, description and category are required');
        return;
      }

      // skills truyền dưới dạng mảng
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      await api.post('/jobs', {
        title,
        description,
        category,
        skillsRequired: skillsArray,
        budget: Number(budget)
      });

      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create job');
    }
  };

  // Nếu user không phải client → redirect /home
  if (user.role !== 'client') {
    navigate('/home');
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Create Job</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full rounded"
            rows={4}
            required
          />
          <input
            type="text"
            placeholder="Category (ex: IT, Marketing)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 w-full"
          >
            Create Job
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreateJob;
