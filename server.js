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
var path = require('path');
var bodyParser = require('body-parser');

// Dependencies for express
var st = require('st');
var morgan = require('morgan'); // logger
var compress = require('compression');

// Custom classes
var checkLang = require('./libs/check-lang');
var getEnabledLanguages = require('./libs/get-enabled-languages');
var secondaryRoutes = require('./libs/secondary-routes');

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

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.set('x-powered-by', null); // Disable extra header

// in express, this lets you call newrelic from within a template
app.locals.newrelic = newrelic;


var langMeta = getEnabledLanguages(pageJson.languages); // Enabled language meta data, needed for language navigation
var langKeys = Object.keys(langMeta); // Enabled language ISO codes: en, fi, ...
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

/**
 * Insert a link to the other language page for the same content
 * @param {object} item Page item
 * @returns {void}
 */
var linkPageLanguages = function linkPageLanguages(item) {
  // Save the current page other languages
  langKeys.forEach(function eachMetaLang(key) {
    if (item[key]) {
      langMeta[key].url = item[key].url;
    }
  });
};

var pageRegex = new RegExp('^\/(' + langKeys.join('|') + ')(\/(\\w+))?$');
app.get(pageRegex, function appGetRegex(req, res) {
  var lang = req.params[0];
  app.set('lang', lang);

  var current = null;
  var pages = [];
  // Get the pages for the given language, in order to create navigation.
  pageJson.pages.forEach(function eachPage(item) {
    if (typeof item[lang] === 'object') {
      if (item[lang].url === req.path) {
        current = item[lang];
        linkPageLanguages(item);
      }
      pages.push(item[lang]);
    }
  });

  if (typeof current !== 'object') {
    res.redirect(404, '/' + lang);
    return;
  }

  current.titlesuffix = pageJson.title[lang];

  var indexData = function indexData() {
    var getContent = require('./libs/get-content');
    var flipAheadLinks = require('./libs/flip-ahead-links');
    var flickrImageList = require('./libs/flickr-image-list');

    var userAgent = req.header('user-agent');
    if (userAgent && userAgent.indexOf('facebookexternalhit') !== -1) {
      var facebookMeta = require('./libs/facebook-meta.js');
      current.facebook = facebookMeta(current, pageJson.facebook);
    }

    return {
      content: getContent(lang, current.url),
      pages: pages,
      flipahead: flipAheadLinks(pages, current),
      footers: pageJson.footer[lang],
      meta: current,
      prefetch: flickrImageList(),
      languages: langMeta,
      lang: lang
    };
  };

  var contentPolicy = require('./libs/content-policy-directives');

  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': contentPolicy(),
    'Content-Language': lang,
    'Accept-Ranges': 'bytes',
    'Timing-Allow-Origin': '*'
  });
  res.render('index', indexData(), function rendered(error, html) {
    if (error) {
      newrelic.noticeError('index', error);
    }
    res.send(html);
  });
});

app.get('/sitemap', secondaryRoutes.getSitemap);
app.post('/violation-report', secondaryRoutes.postViolation);

// Softer landing page
app.get('/', function appGetRoot(req, res) {
  defaultLang = checkLang(req.acceptsLanguages(), langKeys);
  res.redirect(301, '/' + defaultLang);
});

// Catch anything that does not match the previous rules.
app.get('*', function appGetRest(req, res) {
  res.redirect(404, '/' + defaultLang);
});

// https://devcenter.heroku.com/articles/config-vars
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || null; // Heroku fails with non null address
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000;

app.listen(port, ipaddr, function appListen() {
  console.log('Express.js running at http://' + ipaddr + ':' + port + '/');
});
