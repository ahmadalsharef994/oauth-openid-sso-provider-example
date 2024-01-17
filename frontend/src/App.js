import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CallbackComponent from './CallbackComponent'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [token, setToken] = useState(null);

  // useEffect(() => {
  //   // Extract the code from URL query parameters
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');
//  in the context of a Node.js/Express server, req.query.code is used to access the authorization code from the URL query parameters. This is equivalent to using urlParams.get('code') in a client-side JavaScript context like React.


  const login = () => {
    console.log('App.js login')

    const oidcProvider = 'http://localhost:3000';
    const clientId = 'client1';
    const redirectUri = encodeURIComponent('http://localhost:3000/callback');
    window.location.href = `${oidcProvider}/auth?client_id=${clientId}&redirect_uri=${redirectUri}`;
  };

  return (
    <Router>
      <div>
        <h1>Simple OIDC Client</h1>
        {!isAuthenticated && (
          <button onClick={login}>Login with OIDC</button>
        )}
        {/* {isAuthenticated && (
          <div>
            <p>Logged in!</p>
            <p>Token: {token}</p>
          </div>
        )} */}
      </div>
      <Routes>
      {/* <Route path="/callback" element={<CallbackComponent onTokenReceived={exchangeToken} />} /> */}

      </Routes>
    </Router>


  );
};

export default App;

