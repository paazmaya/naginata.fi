/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

// http://expressjs.com
var express = require('express');
var fs = require('fs');

// Keen.IO analytics, used only if the evironment variables are in place.
var keen = null;
if (process && process.env && process.env.KEEN_IO_ID && process.env.KEEN_IO_WRITE) {
  keen = require('keen.io').configure({
    projectId: process.env.KEEN_IO_ID,
    writeKey: process.env.KEEN_IO_WRITE
  });
}

// https://github.com/chjj/marked
var marked = require('marked');
var md = marked.parse;

marked.setOptions({
  gfm: true,
  breaks: false
});

var fsOptions = {
  encoding: 'utf8'
};

var pageData = fs.readFileSync('content/page-data.json', fsOptions);
var pageJson = JSON.parse(pageData);

var app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.compress());
}
app.use(express.static(__dirname + '/public_html'));
app.use(express.logger());

app.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log('Node NOT Exiting...');
});

app.engine('jade', require('jade').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var defaultLang = 'fi';

/**
 * Send data to back end analytics, Keen.IO.
 * @see https://keen.io/docs/clients/javascript/reference/#data-collection
 */
var keenSend = function (type, content) {
  if (!keen) {
    return;
  }
  keen.addEvent(type, content, function(err, res) {
    if (err) {
      console.log('Oh no, an error! ' + err);
    }
    else {
      console.log('Hooray, it worked! ' + res);
    }
  });
};

/**
 * Get the contents of the current page in HTML format.
 * @param {string} lang ISO 2 char language code
 * @param {string} title Page title
 * @returns {string} HTML content
 */
var getContent = function (lang, title) {
  var data = '# 404';
  var path = 'content/' + lang + '/' + title + '.md';
  if (fs.existsSync(path)) {
    data = fs.readFileSync(path, fsOptions);
  }
  else {
    keenSend('not found content', {
      path: path
    });
  }
  return md(data);
};

/**
 * Facebook Open Graph Meta data.
 * @param {Object} page Current page meta data
 * @returns {Array}
 */
var facebookMeta = function (page) {
  // property, name
  var meta = [
    // http://ogp.me/
    {
      property: 'og:title',
      content: page.title
    },
    {
      property: 'og:description',
      content: page.description
    },
    {
      property: 'og:type',
      content: 'sports_team'
    },
    // All the images referenced by og:image must be at least 200px in both dimensions.
    {
      property: 'og:image',
      content: '/img/logo-200x200.png'
    },
    {
      property: 'og:url',
      content: 'http://naginata.fi' + page.url
    },
    {
      property: 'og:site_name',
      content: page.titlesuffix
    },
    {
      property: 'og:locale',
      content: 'fi_FI'
    }, // language_TERRITORY
    {
      property: 'og:locale:alternate',
      content: 'en_GB'
    },
    {
      property: 'og:locale:alternate',
      content: 'ja_JP'
    },
    {
      property: 'og:country-name',
      content: 'Finland'
    },
    // https://developers.facebook.com/docs/opengraph/
    // A Facebook Platform application ID that administers this page.
    {
      property: 'fb:app_id',
      content: pageJson.facebook.app_id
    },
    {
      property: 'fb:admins',
      content: pageJson.facebook.admins
    }
  ];

  return meta;
};

/**
 * Checks if the current language should be changed according to the
 * current users language preferences and thus changes if needed.
 * @param {Array} acceptedLanguages
 * @see http://expressjs.com/api.html#req.acceptedLanguages
 */
var checkLang = function (acceptedLanguages) {
  acceptedLanguages.forEach(function (item) {
    var key = item.substr(0, 2);
    if (pageJson.languages.hasOwnProperty(key) &&
        pageJson.languages[key]['enabled'] === true) {
      defaultLang = item.substr(0, 2);
      return;
    }
  });
};

var langKeys = [];
for (var key in pageJson.languages) {
  if (pageJson.languages.hasOwnProperty(key) &&
      pageJson.languages[key]['enabled'] === true) {
    langKeys.push(key);
  }
}

var pageRegex = new RegExp('^\/(' + langKeys.join('|') + ')(\/(\\w+))?$');

app.get(pageRegex, function (req, res) {
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
    keenSend('redirection', {
      request: req.url,
      responce: '/' + lang
    });
    res.redirect(404, '/' + lang);
    return;
  }
  current.titlesuffix = pageJson.title[lang];

  if (req.header('user-agent').indexOf('facebookexternalhit') !== -1) {
    current.facebook = facebookMeta(current);
  }
  
  // Every visit writes analytics
  keenSend('page view', {
    url: req.originalUrl,
    acceptedLanguages: req.acceptedLanguages,
    acceptedCharsets: req.acceptedCharsets
  });
  

  // https://developer.mozilla.org/en-US/docs/Security/CSP/Using_Content_Security_Policy
  res.set({
    'Content-Security-Policy-Report-Only': 'default-src \'self\' ' +
      '*.vimeo.com *.youtube.com ' +
      '*.flickr.com *.staticflickr.com ' +
      '*.googleapis.com *.googleusercontent.com',
    'Content-Language': lang,
    'Accept-Ranges': 'bytes'
  });
  res.render('index', {
    content: getContent(lang, current.title),
    pages: pages,
    footers: pageJson.footer[lang],
    meta: current,
    languages: pageJson.languages,
    lang: lang
  }, function (error, html) {
    if (error) {
      keenSend('error', error);
    }
    res.send(html);
  });
});

// Softer landing page
app.get('/', function (req, res) {
  checkLang(req.acceptedLanguages);
  res.redirect(301, '/' + defaultLang);
});

// Catch anything that does not match the previous rules.
app.get('*', function (req, res) {
  keenSend('redirection', {
    url: req.originalUrl,
    responce: '/' + defaultLang
  });
  res.redirect(404, '/' + defaultLang);
});

// https://devcenter.heroku.com/articles/config-vars
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || null; // Heroku fails with non null address
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000;

app.listen(port, ipaddr, function () {
  console.log('Express.js running at http://' + ipaddr + ':' + port + '/');
});
