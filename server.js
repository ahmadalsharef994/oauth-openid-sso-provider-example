const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');


const app = express();
const port = 3000;

// Mock data
const users = { 'user1': 'password1' };


// Ensure that client_secret is handled securely. It should not be exposed in the frontend for production applications. In a real-world scenario, the token exchange step is typically handled in a secure backend to keep the client_secret confidential.


// Registered clients
const clients = {
  'client1': { secret: 'secret1', redirectUri: 'http://localhost:3000/callback' },
  // Add other clients as needed
};

// Temporary storage for authorization codes
const codes = {};

// Function to generate a unique authorization code
const generateUniqueCode = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Function to generate a token based on the authorization code
const generateTokenForCode = (code) => {
  if (!codes[code]) {
    return null;
  }

  const payload = {
    user: codes[code].username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
  };

  const token = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  delete codes[code]; // Invalidate the code after use
  return token;
};

// client_secret is a credential known only to the application (client) and the authorization server. It's used to authenticate the identity of the application to the server when the application requests to exchange an authorization code for an access token

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




  // Configure CORS
app.use(cors({
  origin: 'http://localhost:3001', // Replace with your React app's URL
  credentials: true // Set to true if your frontend needs to send cookies or authorization headers
}));

app.post('/login', (req, res) => {
  console.log('server.js /login');

  const { username, password, clientId, redirectUri } = req.body;
  console.log(`Received username: ${username}, clientId: ${clientId}, and redirectUri: ${redirectUri}`);

  // Validate clientId and redirectUri
  // if (!clients[clientId] || clients[clientId].redirectUri !== redirectUri) {
  //   return res.status(400).json({ error: 'Invalid clientId or redirectUri' });
  // }

  // Authenticate the user
  if (users[username] === password) {
    const code = generateUniqueCode(); // Generate a unique authorization code
    codes[code] = { username, clientId }; // Store the code with associated data

    res.json({ code }); // Send the authorization code back to the frontend in JSON format
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Respond with error if authentication fails
  }
});

  
  app.post('/token', (req, res) => {
    const code = req.body.code;
    if (code) {
      // Assuming you have a function to handle token generation
      const token = generateTokenForCode(code);
      res.json({ id_token: token });
    } else {
      res.status(401).send('Unauthorized');
    }
  });



  app.listen(port, () => {
    console.log(`OIDC Provider listening at http://localhost:${port}`);
  });
  