const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');


const app = express();
const port = 3000;

// Mock data
const users = { 'user1': 'password1' };
const clients = { 'client1': { secret: 'secret1', redirectUri: 'http://localhost:3000/callback' } };
const codes = {};
const tokens = {};

const generateUniqueCode = () => {
  return crypto.randomBytes(20).toString('hex');
};

const generateTokenForCode = (code) => {
  if (!codes[code]) {
    return null;
  }

  // Example payload. In real applications, consider including more information
  const payload = {
    user: codes[code].username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 5), // Token expiration (e.g., 5 hour)
  };

  // Generate a token. You might use libraries like jsonwebtoken for more robust implementation
  const token = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

  // Store the token with the payload for later validation
  tokens[token] = payload;

  // Optionally delete the code to prevent reuse
  delete codes[code];

  return token;
};


// client_secret is a credential known only to the application (client) and the authorization server. It's used to authenticate the identity of the application to the server when the application requests to exchange an authorization code for an access token

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));


app.listen(port, () => {
  console.log(`OIDC Provider listening at http://localhost:${port}`);
});


app.get('/auth', (req, res) => {
  console.log('server.js /auth')
    const clientId = req.query.client_id;
    const redirectUri = req.query.redirect_uri;
    console.log(`I know client_id ${clientId} and redirectUri ${redirectUri} and you will input username and password`)

    // Simple login form
    res.send(`
      <form action="/login" method="post">
        <input type="hidden" name="client_id" value="${clientId}" />
        <input type="hidden" name="redirect_uri" value="${redirectUri}" />
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <button type="submit">Login</button>
      </form>
    `);
  });
  
  app.post('/login', (req, res) => {
    console.log('server.js /login')

    const { username, password, client_id, redirect_uri } = req.body;
    console.log(`I know username and password ad client_id ${username} and redirect_uri ${redirect_uri} and will calculate the code uniquely and send it to redirect_uri`)

    if (users[username] === password) {
      const code = generateUniqueCode(); // This should be generated uniquely
      codes[code] = { username, client_id };
      console.log(codes)
      res.redirect(`${redirect_uri}?code=${code}`);
    } else {
      res.status(401).send('Unauthorized');
    }
  });

  // });
  
  app.get('/callback', (req, res) => {
    const code = req.query.code;
    if (code && codes[code]) {
      // Assuming you have a function to handle token generation
      const token = generateTokenForCode(code);
      res.json({ id_token: token });
    } else {
      res.status(401).send('Unauthorized');
    }
  });


  // app.post('/token', (req, res) => {
  //   const { code, client_id, client_secret } = req.body;
  
  //   if (!codes[code] || !clients[client_id] || clients[client_id].secret !== client_secret) {
  //     return res.status(401).send('Unauthorized');
  //   }
  
  //   const token = generateTokenForCode(code);
  //   if (token) {
  //     res.json({ access_token: token });
  //   } else {
  //     res.status(400).send('Invalid request');
  //   }
  // });

  
  // The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});
