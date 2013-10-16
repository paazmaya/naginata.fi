/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License http://creativecommons.org/licenses/by-sa/3.0/
 *
 * server.js
 *
 * Dependencies:
 *   Node.js
 *   Express.js
 */
'use strict';

// http://expressjs.com
var express = require('express');
var fs = require('fs');
var md = require('marked').parse;

var pageData = fs.readFileSync('content/page-data.json', { encoding: 'utf8' });
var pageJson = JSON.parse(pageData);


var app = express();
app.use(express.logger());
//app.use(express.compress());
app.use(express.static(__dirname + '/public_html'));

app.engine('jade', require('jade').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var defaultLang = 'fi';

var getContent = function (lang, title) {
  var data = fs.readFileSync(
    'content/' + lang + '/' + title + '.md',
    { encoding: 'utf8' }
  );
  return md(data);
};

var facebookMeta = function (page) {
  // property, name
  var meta = [
    // http://ogp.me/
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:type', content: 'sports_team' },

    // All the images referenced by og:image must be at least 200px in both dimensions.
    { property: 'og:image', content: '/img/logo-200x200.png' },

    { property: 'og:url', content: 'http://naginata.fi' + page.url },
    { property: 'og:site_name', content: page.titlesuffix },
    { property: 'og:locale', content: 'fi_FI' }, // language_TERRITORY
    { property: 'og:locale:alternate', content: 'en_GB' },
    { property: 'og:locale:alternate', content: 'ja_JP' },
    { property: 'og:country-name', content: 'Finland' },

    // https://developers.facebook.com/docs/opengraph/
    // A Facebook Platform application ID that administers this page.
    { property: 'fb:app_id', content: pageJson.facebook.app_id },
    { property: 'fb:admins', content: pageJson.facebook.admins }
  ];

  return meta;
};

var langKeys = [];
for (var key in pageJson.title) {
  if (pageJson.title.hasOwnProperty(key)) {
    langKeys.push(key);
  }
}

var pageRegex = new RegExp('^\/(' + langKeys.join('|') + ')(\/(\w+))?$');


app.get(pageRegex, function(req, res) {
  var lang = req.params[0];
  app.set('lang', lang);

  var current = null;
  var pages = pageJson.pages.filter(function (item) {
    if (item.url.substr(0, 3) === '/' + lang) {

      // Use this loop to catch the current page meta
      if (item.url === req.path) {
        current = item;
      }
      return true;
    }
    return false;
  });

  if (current === null) {
    res.redirect('/' + lang); // TODO: add not found code
  }
  current.titlesuffix = pageJson.title[lang];

  if (req.header('user-agent').indexOf('facebookexternalhit') !== -1) {
    current.facebook = facebookMeta(current);
  }

  var html = getContent(lang, current.title);
  res.render('index', { content: html, pages: pages, footers: pageJson.footer[lang], meta: current, lang: lang });
});

// Catch anything that does not match the previous get.
app.get('*', function(req, res) {
  res.redirect('/' + defaultLang);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
