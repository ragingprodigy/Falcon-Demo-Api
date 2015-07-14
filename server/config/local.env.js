'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "primedemoapi-secret",
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',
    PARSE_APP_KEY: 'vPcptSTbD4vz6A0fTQPBmZxSldpP5quDXs206lWj',
    PARSE_JS_KEY: 'F059sZ0fLJvNZvroK9XDDiW3GyjEqgXDhrfkuIbZ'
};
