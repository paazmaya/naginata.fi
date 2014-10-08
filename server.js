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

var fs = require('fs');


// Custom classes
var app = require('./libs/express-app');
var checkLang = require('./libs/check-lang');
var getEnabledLanguages = require('./libs/get-enabled-languages');
var helpers = require('./libs/express-helpers');



var pageData = fs.readFileSync('./content/page-data.json', {
  encoding: 'utf8'
});
var pageJson = JSON.parse(pageData);


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
        langMeta = helpers.linkPageLanguages(langMeta, item);
      }
      pages.push(item[lang]);
    }
  });

  if (typeof current !== 'object') {
    res.redirect('/' + lang);
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


  res.set(helpers.indexHeaders(lang));
  res.render('index', indexData(), function rendered(error, html) {
    if (error) {
      newrelic.noticeError('index', error);
    }
    res.send(html);
  });
});

// Try to find the cause
app.get('/undefined', function appGetRoot(req, res) {
  var error = {
    checkLang: checkLang(req.acceptsLanguages(), langKeys),
    acceptsLanguages: req.acceptsLanguages(),
    langKeys: langKeys,
    defaultLang: defaultLang
  };
  newrelic.noticeError('slash-undefined', error);
  res.redirect('/en');
});

// Softer landing page
app.get('/', function appGetRoot(req, res) {
  defaultLang = checkLang(req.acceptsLanguages(), langKeys);
  res.redirect('/' + defaultLang);
});

// Catch anything that does not match the previous rules.
app.get('*', function appGetRest(req, res) {
  defaultLang = checkLang(req.acceptsLanguages(), langKeys);
  res.redirect('/' + defaultLang);
});

// https://devcenter.heroku.com/articles/config-vars
var port = process.env.PORT || 5000;

app.listen(port, function appListen() {
  console.log('server.js running at port: ' + port);
});
