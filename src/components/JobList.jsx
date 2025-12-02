import React, { useEffect, useState } from 'react';
import api from '../api/api';
import JobCard from './JobCard';

const JobList = ({ jobs: initialJobs }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      // defensive: api responses can sometimes be null/undefined or have different shapes
      console.log('Jobs from API:', res);

      // Guard against res being null, res.data null, or jobs being non-array
      const body = res?.data ?? null;
      let jobsFromApi = [];

      if (!body) {
        console.warn('Warning: /jobs returned empty body', res);
        jobsFromApi = [];
      } else if (Array.isArray(body)) {
        // Some endpoints may simply return an array
        jobsFromApi = body;
      } else if (Array.isArray(body.jobs)) {
        jobsFromApi = body.jobs;
      } else if (body._id) {
        // single job returned — wrap into array
        jobsFromApi = [body];
      } else {
        // unknown shape — attempt to coerce to empty array
        console.warn('Unrecognized /jobs response shape, falling back to empty array', body);
        jobsFromApi = [];
      }

      setJobs(jobsFromApi);
    } catch (err) {
      console.error('Fetch jobs error:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Nếu có initialJobs từ props, dùng ngay
  useEffect(() => {
    if (initialJobs) {
      // accept either an array or an object that contains .jobs
      const fromProps = Array.isArray(initialJobs)
        ? initialJobs
        : initialJobs.jobs ?? [];
      setJobs(fromProps);
      setLoading(false);
    } else {
      fetchJobs();
    }
  }, [initialJobs]);

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => <JobCard key={job._id} job={job} />)
      )}
    </div>
  );
};

export default JobList;
