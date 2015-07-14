/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors'),
    Parse = require('parse').Parse,
    seed = require('./api/judgment/judgment.model'),
    _ = require('underscore');

module.exports = function(app) {

    // Seed Data Here
    var Judgment = Parse.Object.extend('Judgment'),
        Analysis = Parse.Object.extend('Analysis'),
        Page = Parse.Object.extend('Page');

    var query = new Parse.Query(Judgment);

    query.count().then(function(howMany){

       if (howMany < 1) {
           var i = 0;

           while (i < seed.length) {
               var judgment = new Judgment();
               // Explicitly specify which fields to save to prevent bad input data
               judgment.save(_.pick(seed[i], 'suitno', 'case_title', 'case_title2', 'citation', 'appellant', 'respondent', 'appellant_counsel','judges','respondent_counsel','case_origin','party','editorial_team','date','summary'));

               // Save Ratios
               for (var j = 0; j<seed[i].ratios.length; j++) {
                   var analysis = new Analysis();
                   analysis.set('suitno', seed[i].suitno);
                   analysis.save(seed[i].ratios[j]);
               }

               // Save Pages
               for (var k = 0; k<seed[i].pages.length; k++) {
                   var page = new Page();
                   page.set('suitno', seed[i].suitno);
                   page.save(seed[i].pages[k]);
               }

               i++;
           }
       }
    });

  // Insert routes below
  app.use('/api/judgments', require('./api/judgment'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
