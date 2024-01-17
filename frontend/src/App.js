// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import Callback from './Callback';
import Dashboard from './Dashboard';

const App = () => {
  const { isAuthenticated, token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Dashboard token={token} />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default App;
