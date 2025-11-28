import React, { useEffect, useState } from 'react';
import api from '../api/api';
import JobCard from './JobCard';

const JobList = ({ jobs: initialJobs }) => {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [loading, setLoading] = useState(!initialJobs);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs'); 
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialJobs) fetchJobs();
  }, [initialJobs]);

  useEffect(() => {
    if (initialJobs) setJobs(initialJobs);
  }, [initialJobs]);

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      )}
    </div>
  );
};

export default JobList;
