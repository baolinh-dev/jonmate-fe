import React, { useState, useEffect } from 'react';
import api from '../api/api';
import JobList from '../components/JobList';

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState(''); // nếu muốn filter theo category
  const [skills, setSkills] = useState(''); // filter theo skills

  // Fetch jobs từ API, có thể truyền params để search/filter
  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/search', { params });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // load all jobs khi component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle submit form search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ keyword, category, skills });
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Jobs</h1>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search by keyword"
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <JobList jobs={jobs} />
      )}
    </div>
  );
};

export default JobPage;
