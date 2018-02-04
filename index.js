const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();



app.get('/api', (req, res) => {
	res.json({
		message: 'Welcome to the API'
	});
});

app.post('/api/posts', verifyToken, (req, res) => {  

  let db = {
    "one":   {"email": "brad@gmail.com", "secret": "secrethyuj"},
    "two":   {"email": "ivo@gmail.com", "secret": "koijuyhgs"},
    "three": {"email": "pablo@gmail.com", "secret": "jouhsnh"}
	}	

  // get the decoded payload ignoring signature, no secretOrPrivateKey needed
  var decoded = jwt.decode(req.token);
	
  // get the decoded payload and header
  var decoded = jwt.decode(req.token, {complete: true});
  //console.log(decoded.header);
  //console.log(decoded.payload)

  let id = decoded.payload.user.id;  	

  jwt.verify(req.token, db[id].secret, (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 'two', 
    username: 'ivo',
    email: 'ivo@gmail.com'
  }

  jwt.sign({user}, 'koijuyhgs', { expiresIn: '1 day' }, (err, token) => {
    res.json({
      token
    });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}


app.listen(5000,() => console.log('Server started on port 5000'));