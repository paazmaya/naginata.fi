/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var path = require('path');

// http://expressjs.com
var express = require('express');

// Dependencies for express
var compress = require('compression');
var bodyParser = require('body-parser');
var st = require('st');
var morgan = require('morgan'); // logger

// Custom modules
var secondaryRoutes = require('./secondary-routes');

var app = express();

app.use(compress());
app.use(bodyParser.json({
  type: 'application/csp-report'
}));

var oneMinute = 1000 * 60;
app.use(st({
  path: path.join(__dirname, '/../public_html'),
  url: '/',
  index: false, // return 404's for directories
  passthrough: true, // calls next/returns instead of returning a 404 error
  gzip: false,
  cache: { // specify cache:false to turn off caching entirely
    fd: {
      max: 1000, // number of fd's to hang on to
      maxAge: oneMinute * 60 // amount of ms before fd's expire
    },

    stat: {
      max: 5000, // number of stat objects to hang on to
      maxAge: oneMinute // number of ms that stats are good for
    },

    content: {
      max: 1024 * 1024 * 64, // how much memory to use on caching contents
      maxAge: oneMinute * 10 // how long to cache contents for
    }
  }
}));
app.use(morgan('tiny'));

app.on('uncaughtException', function uncaughtException(error) {
  global.newrelic.noticeError('uncaughtException', error);
  console.log('Node NOT Exiting...');
});

app.engine('jade', require('jade').__express);

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
// in express, this lets you call newrelic from within a template
app.locals.newrelic = global.newrelic;

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'jade');
app.set('x-powered-by', null); // Disable extra header

app.get('/sitemap', secondaryRoutes.getSitemap);
app.post('/violation-report', secondaryRoutes.postViolation);

module.exports = app;
