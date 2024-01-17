// Callback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const Callback = () => {
  console.log('Callback rendered');

  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // this in browser is similar to req.query.code on server side
    console.log(' calling /token api')

    if (code) {
      // /token endpoint is expected to take code and response with token
      fetch('http://localhost:3000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ code }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Token exchange failed');
        }
        return response.json();
      })
      .then(data => {
        login(data.id_token); // Update the authentication state
        navigate('/'); // Navigate to the home page (login or dashboard) deending on authentication state
      })
      .catch(error => {
        setError('Token exchange failed: ' + error.message);
        navigate('/login'); // Redirect back to the login page on error
      });
    }
  }, [login, navigate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return <div>Exchanging code for token...</div>;
};

export default Callback;

