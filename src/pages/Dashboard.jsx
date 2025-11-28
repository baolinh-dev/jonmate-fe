import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome to JobMate — quick links:</p>
      <ul>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
