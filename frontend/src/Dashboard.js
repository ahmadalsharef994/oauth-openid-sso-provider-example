// Dashboard.js
import React from 'react';

const Dashboard = ({ token }) => {
  // Rendering the dashboard using the token
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Your token is: {token}</p>
    </div>
  );
};

export default Dashboard;
