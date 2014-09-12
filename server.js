/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

// New Relic
var newrelic = require('newrelic');
// Make it directly available from other modules
global.newrelic = newrelic;

// http://expressjs.com
var express = require('express');
var fs = require('fs');
var spdy = require('spdy');
var path = require('path');
var bodyParser = require('body-parser');

// Dependencies for express
var st = require('st');
var morgan = require('morgan'); // logger
var compress = require('compression');

// Custom classes
var getContent = require('./libs/get-content');
var flickrImageList = require('./libs/flickr-image-list');
var checkLang = require('./libs/check-lang');

var pageData = fs.readFileSync('content/page-data.json', {
  encoding: 'utf8'
});
var pageJson = JSON.parse(pageData);

var app = express();

app.use(compress());
app.use(bodyParser.json({
  type: 'application/csp-report'
}));

var oneMinute = 1000 * 60;
app.use(st({
  path: path.join(__dirname, '/public_html'),
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

app.on('uncaughtException', function uncaughtException(err) {
  console.error(err.stack);
  console.log('Node NOT Exiting...');
});

app.engine('jade', require('jade').__express);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.set('x-powered-by', null); // Disable extra header

// in express, this lets you call newrelic from within a template
app.locals.newrelic = newrelic;



var langKeys = []; // Enabled language ISO codes: en, fi, ...
var langMeta = {}; // Enabled language meta data, needed for language navigation
Object.keys(pageJson.languages).forEach(function forMetaLangs(key) {
  if (pageJson.languages[key].enabled === true) {
    langKeys.push(key);
    langMeta[key] = pageJson.languages[key];
  }
});
var defaultLang = langKeys[0];

// Handle every GET request and pass thru if not using www.
/*
app.get('*', function appGetAll(req, res, next) {
  console.log('subdomains', req.subdomains);
  console.log('req.host', req.host);
  if (req.host.match(/^www/) !== null ) {
    var url = req.protocol + '://' + req.host.replace(/^www\./, '') + req.originalUrl;
    console.log('Should redirect to: ' + url);
    res.redirect(301, url);
  }
  else {
    next();
  }
});
*/

var pageRegex = new RegExp('^\/(' + langKeys.join('|') + ')(\/(\\w+))?$');
app.get(pageRegex, function appGetRegex(req, res) {
  var lang = req.params[0];
  app.set('lang', lang);

  var current = null;
  var pages = [];
  // Get the pages for the given language, in order to create navigation.
  pageJson.pages.forEach(function eachPage(item) {
    if (item[lang]) {
      if (item[lang].url === req.path) {
        current = item[lang];
        // Save the current page other languages
        Object.keys(langMeta).forEach(function eachMetaLang(key) {
          if (item[key]) {
            langMeta[key].url = item[key].url;
          }
        });
      }
      pages.push(item[lang]);
    }
  });

  if (current === null) {
    res.redirect(404, '/' + lang);
    return;
  }
  current.titlesuffix = pageJson.title[lang];

  var userAgent = req.header('user-agent');
  if (userAgent && userAgent.indexOf('facebookexternalhit') !== -1) {
    var facebookMeta = require('./libs/facebook-meta.js');
    current.facebook = facebookMeta(current, pageJson.facebook);
  }

  var flipAheadLinks = require('./libs/flip-ahead-links');

  // https://developer.mozilla.org/en-US/docs/Security/CSP/Using_Content_Security_Policy
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': 'default-src \'self\' ' +
      '*.vimeo.com *.youtube.com ' +
      'https://*.vimeo.com https://*.youtube.com ' +
      '*.flickr.com *.staticflickr.com ' +
      '*.gstatic.com ' +
      '*.googleapis.com *.googleusercontent.com ' +
      '*.google-analytics.com *.doubleclick.net' +
      '; report-uri /violation-report',
    'Content-Language': lang,
    'Accept-Ranges': 'bytes',
    'Timing-Allow-Origin': '*'
  });
  res.render('index', {
    content: getContent(lang, current.url),
    pages: pages,
    flipahead: flipAheadLinks(pages, current),
    footers: pageJson.footer[lang],
    meta: current,
    prefetch: flickrImageList(),
    languages: langMeta,
    lang: lang
  }, function rendered(error, html) {
    if (error) {
      newrelic.noticeError(error);
    }
    res.send(html);
  });
});

// sitemap.org
app.get('/sitemap', function appGetSitemap(req, res) {
  res.set({'Content-type': 'application/xml'});
  var sitemap = require('./libs/sitemap.js');
  res.render('sitemap', {
    pages: sitemap(pageJson)
  }, function renderSitemap(error, html) {
    if (error) {
      newrelic.noticeError(error);
    }
    res.send(html);
  });
});

// https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_CSP_violation_reports
app.post('/violation-report', function appGetViolation(req, res) {
  res.set({'Content-type': 'application/json'});
  if (typeof req.body === 'object') {
    var violation = require('./libs/violation-report-receiver.js');
    violation(req.body, function violationCallback(report, outgoing) {
      newrelic.noticeError('CSP-policy-violation', report);
      res.json(outgoing);
    });
  }
  else {
    res.json('{"hups":"0"}');
  }
});

// Softer landing page
app.get('/', function appGetRoot(req, res) {
  defaultLang = checkLang(req.acceptsLanguages(), pageJson.languages);
  res.redirect(301, '/' + defaultLang);
});

// Catch anything that does not match the previous rules.
app.get('*', function appGetRest(req, res) {
  res.redirect(404, '/' + defaultLang);
});

// https://devcenter.heroku.com/articles/config-vars
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || null; // Heroku fails with non null address
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000;

// https://github.com/indutny/node-spdy
/*
var spdyOptions = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt'),
  ca: fs.readFileSync(__dirname + '/keys/server.csr'),

  // **optional** SPDY-specific options
  windowSize: 1024 * 1024, // Server's window size

  // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
  autoSpdy31: false

  //plain: false
};
var server = spdy.createServer(spdyOptions, app);
*/

app.listen(port, ipaddr, function appListen() {
  console.log('Express.js running at http://' + ipaddr + ':' + port + '/');
});
