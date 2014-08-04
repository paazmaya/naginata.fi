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

// http://expressjs.com
var express = require('express');
var fs = require('fs');
var spdy = require('spdy');
var path = require('path');

// Dependencies for express
var st = require('st');
var bodyParser = require('body-parser');
var morgan = require('morgan'); // logger
var responseTime = require('response-time');
var compress = require('compression');

// Custom classes
var getContent = require('./libs/get-content');
var flickrImageList = require('./libs/flickr-image-list');

var fsOptions = {
  encoding: 'utf8'
};

var pageData = fs.readFileSync('content/page-data.json', fsOptions);
var pageJson = JSON.parse(pageData);

var app = express();

app.use(compress());

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
app.use(morgan());
app.use(bodyParser());
app.use(responseTime());

app.on('uncaughtException', function uncaughtException(err) {
  console.error(err.stack);
  console.log('Node NOT Exiting...');
});

app.engine('jade', require('jade').__express);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

// in express, this lets you call newrelic from within a template
app.locals.newrelic = newrelic;

var defaultLang = 'fi';

/**
 * Checks if the current language should be changed according to the
 * current users language preferences and thus changes if needed.
 * @param {Array} acceptsLanguages The languages accepted by the current user agent
 * @see http://expressjs.com/api.html#req.acceptsLanguages
 * @returns {?} Nothing
 */
var checkLang = function checkLang(acceptsLanguages) {
  acceptsLanguages.forEach(function forLangs(item) {
    var key = item.substr(0, 2);
    if (pageJson.languages.hasOwnProperty(key) &&
        pageJson.languages[key].enabled === true) {
      defaultLang = item.substr(0, 2);
      return;
    }
  });
};

var langKeys = []; // Enabled language ISO codes: en, fi, ...
var langMeta = {}; // Enabled language meta data, needed for language navigation
Object.keys(pageJson.languages).forEach(function forMetaLangs(key) {
  if (pageJson.languages[key].enabled === true) {
    langKeys.push(key);
    langMeta[key] = pageJson.languages[key];
  }
});

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
    var facebookMeta = require(path.join(__dirname, '/libs/facebookMeta.js'));
    current.facebook = facebookMeta(current, pageJson.facebook);
  }

  // Flip ahead browsing: prev, next
  var index = pages.indexOf(current);
  var prev = index > 0 ? index - 1 : pages.length - 1;
  var next = index < pages.length - 1 ? index + 1 : 0;
  var flips = [
    {
      rel: 'next',
      url: pages[next].url
    },
    {
      rel: 'prev',
      url: pages[prev].url
    }
  ];

  // https://developer.mozilla.org/en-US/docs/Security/CSP/Using_Content_Security_Policy
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': 'default-src \'self\' ' +
      '*.vimeo.com *.youtube.com ' +
      'https://*.vimeo.com https://*.youtube.com ' +
      '*.flickr.com *.staticflickr.com ' +
      '*.googleapis.com *.googleusercontent.com ' +
      '*.google-analytics.com *.doubleclick.net',
    'Content-Language': lang,
    'Accept-Ranges': 'bytes',
    'Timing-Allow-Origin': '*'
  });
  res.render('index', {
    content: getContent(lang, current.url),
    pages: pages,
    flipahead: flips,
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
  var sitemap = require(path.join(__dirname, '/libs/sitemap.js'));
  res.render('sitemap', {
    pages: sitemap(pageJson)
  }, function renderSitemap(error, html) {
    if (error) {
      newrelic.noticeError(error);
    }
    res.send(html);
  });
});

// Softer landing page
app.get('/', function appGetRoot(req, res) {
  checkLang(req.acceptsLanguages());
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
