import React, { useState } from 'react';
import api from '../api/api';

const JobSearch = ({ onResults }) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const query = new URLSearchParams();
      if (keyword) query.append('keyword', keyword);
      if (category) query.append('category', category);

      const res = await api.get(`/jobs/search?${query.toString()}`);
      onResults(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
      <input
        type="text"
        placeholder="Search by keyword"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
      />
      <input
        type="text"
        placeholder="Search by category"
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        Search
      </button>
    </form>
  );
};

export default JobSearch;
