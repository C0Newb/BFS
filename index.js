const httpPort = 80;
const httpsPort = 443;


const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to log IP and timestamp
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${new Date().toISOString()}] Request from IP: ${ip}, Endpoint: ${req.path}`);
  next();
});

app.all('*', (req, res) => {
  // Get the requested file path based on the endpoint
  // Default to `index.html`
  const filePath = path.join(__dirname, 'Web', (req.path == "/")? "index.html" : req.path);

  // Send the file as the response
  res.sendFile(filePath, (err) => {
    if (err) {
      // Handle error if the file is not found
      res.status(404).send('File not found');
    }
  });
});


// Start HTTP server
http.createServer(app).listen(httpPort, () => {
  console.log(`HTTP server listening at http://localhost:${httpPort}`);
});

// Configure HTTPS options
try {
  const httpsOptions = {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
  };

  // Start HTTPS server (?)
  https.createServer(httpsOptions, app).listen(httpsPort, () => {
    console.log(`HTTPS server listening at https://localhost:${httpsPort}`);
  });
} catch (e) {
  console.log(`Failed to setup HTTPs.`);
  console.error(e);
}