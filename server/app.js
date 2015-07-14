/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
var Parse = require('parse').Parse;

Parse.initialize('vPcptSTbD4vz6A0fTQPBmZxSldpP5quDXs206lWj', 'F059sZ0fLJvNZvroK9XDDiW3GyjEqgXDhrfkuIbZ');

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;