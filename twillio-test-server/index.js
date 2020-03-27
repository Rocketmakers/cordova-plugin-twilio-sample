require('dotenv').load();

const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const methods = require('./src/server.js');
const tokenGenerator = methods.tokenGenerator;
const makeCall = methods.makeCall;
const statusCallback = methods.statusCallback;
var cors = require('cors');

// Create Express webapp
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.get('/accessToken', function (request, response) {
  tokenGenerator(request, response);
});

app.post('/accessToken', function (request, response) {
  tokenGenerator(request, response);
});

app.get('/makeCall', function (request, response) {
  makeCall(request, response);
});

app.post('/makeCall', function (request, response) {
  makeCall(request, response);
});

app.post('/statusCallback', function (request, response) {
  statusCallback(request, response);
});

// Create an http server and run it
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Express server running on *:' + port);
});
