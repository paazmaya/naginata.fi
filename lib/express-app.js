/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const path = require('path');

// http://expressjs.com
const express = require('express');

// Dependencies for express
const compress = require('compression');
const bodyParser = require('body-parser'); // incoming data parser
const st = require('st'); // static content
const morgan = require('morgan'); // logger
const swig = require('swig'); // templates

// Custom modules
const secondaryRoutes = require('./secondary-routes');

const app = express();

app.use(compress());
app.use(bodyParser.json({
  type: 'application/csp-report'
}));

const oneMinute = 1000 * 60;
app.use(st({
  path: path.join(__dirname, '/../public_html'),
  url: '/',
  index: false, // return 404's for directories
  passthrough: true, // calls next/returns instead of returning a 404 error
  gzip: false,
  cache: {// specify cache:false to turn off caching entirely
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
      maxAge: oneMinute * 120 // how long to cache contents for
    }
  }
}));
app.use(morgan('tiny'));

app.on('uncaughtException', function uncaughtException(error) {
  console.log('Node NOT Exiting...');
  console.log(error);
});

// Disable Swig cache, since the one provided by Express will be used
swig.setDefaults({
  cache: false
});

// Render HTML files via Swig
app.engine('html', swig.renderFile);

const appEnv = app.get('env');
if (appEnv === 'development') {
  app.locals.pretty = true;
}

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'html');
app.set('x-powered-by', null); // Disable extra header

app.get('*', secondaryRoutes.appGetAll);
app.get('/sitemap', secondaryRoutes.getSitemap);

module.exports = app;
