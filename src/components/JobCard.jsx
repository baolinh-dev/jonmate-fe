import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-bold">{job.title}</h3>
      <p className="text-gray-700">{job.description}</p>
      <p className="mt-2 text-sm text-gray-500">
        Category: {job.category.name} | Budget: ${job.budget}
      </p>
    </div>
  );
};

export default JobCard;
