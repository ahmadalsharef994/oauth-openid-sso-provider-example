// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const clientId = 'client1'; // in real-life scenario this isn't hardcoded
  const redirectUri = 'http://localhost:3000/callback' // in real-life scenario this isn't hardcoded

  const handleLogin = (e) => {
    e.preventDefault();
    // The oauth login endpoint is expected to respone with code (authorization code)
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username,
        password,
        // clientId and redirectUri should be known by the server and the client
        clientId,
        redirectUri
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    })
    .then(data => {
      navigate(`/callback?code=${data.code}`);
    })
    .catch(error => {
      throw new Error('Login failed: ' + error.message);
    });
  };

  return (
    <div>
      <form onSubmit={handleLogin}>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
