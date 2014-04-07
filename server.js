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
var spdy = require('spdy');

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
  // Compress response data with gzip/deflate.
  app.use(express.compress());
}

// Static file server with the given root path.
app.use(express.static(__dirname + '/public_html'));

// Log requests with the given options or a format string,  ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
app.use(express.logger());

// Parse JSON request bodies, providing the parsed object as req.body.
app.use(express.json());

// Parse x-ww-form-urlencoded request bodies, providing the parsed object as req.body using https://github.com/visionmedia/node-querystring
app.use(express.urlencoded());

// Adds the X-Response-Time header displaying the response duration in milliseconds.
app.use(express.responseTime());

// Times out the request in ms, defaulting to 5000
app.use(express.responseTime(1200));

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
  console.log('keenSend. type: ' + type + ', content: ' + content);
  if (!keen) {
    return;
  }
  keen.addEvent(type, content, function(err, res) {
    if (err) {
      console.log('Keen.IO error: ' + err);
    }
    else {
      console.log('Keen.IO responce: ' + res);
    }
  });
};

/**
 * Get the contents of the current page in HTML format.
 * @param {string} lang ISO 2 char language code
 * @param {string} url Page URL, including the language
 * @returns {string} HTML content
 */
var getContent = function (lang, url) {
  var data = '# 404';
  url = url.replace('/' + lang, '').replace('/', '');
  if (url === '') {
    url = 'index';
  }
  var path = 'content/' + lang + '/' + url + '.md';
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
 * Iterate all pages for the current language and get a list of unique Flick images.
 * TODO: Cache results...
 */
var flickrImageList = function () {
  // If any of the files in 'content/*/*.md' has changed, update the whole cache.
  var regex = new RegExp('\\((http:\\/\\/farm\\d+\\.static\\.?flickr\\.com\\S+\\_m.jpg)\\)', 'g');

  // Loop all Markdown files under content/*/
  var dir = 'content/';
  var directories = fs.readdirSync(dir);
  directories = directories.filter(function (item) {
    var stats = fs.statSync(dir + item);
    return stats.isDirectory();
  });

  var images = []; // thumbnails of Flickr images

  // Read their contents
  directories.forEach(function (directory) {
    var files = fs.readdirSync(dir + directory);
    files.forEach(function (file) {
      if (file.split('.').pop() === 'md') {
        var path = dir + directory + '/' + file;
        var content = fs.readFileSync(path, fsOptions);

        var matches;
        while ((matches = regex.exec(content)) !== null) {
          images.push(matches[1]);
        }
      }
    });
  });

  // Only unique
  images = images.filter(function (e, i, arr) {
    return arr.lastIndexOf(e) === i;
  });

  //var json = JSON.stringify(images);

  return images;
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
        pageJson.languages[key].enabled === true) {
      defaultLang = item.substr(0, 2);
      return;
    }
  });
};

var langKeys = []; // Enabled language ISO codes: en, fi, ...
var langMeta = {}; // Enabled language meta data, needed for language navigation
for (var key in pageJson.languages) {
  if (pageJson.languages.hasOwnProperty(key) &&
      pageJson.languages[key].enabled === true) {
    langKeys.push(key);
    langMeta[key] = pageJson.languages[key];
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
  
  // prev, next
  var index = pages.indexOf(current);
  var prev = index > 0 ? index - 1 : pages.length - 1;
  var next = index < pages.length - 1 ? index + 1 : 0;
  console.log(index, prev, next);
  pages[prev].rel = 'prev';
  pages[next].rel = 'next';

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
      '*.googleapis.com *.googleusercontent.com ' +
      '*.google-analytics.com',
    'Content-Language': lang,
    'Accept-Ranges': 'bytes',
    'Timing-Allow-Origin': '*'
  });
  res.render('index', {
    content: getContent(lang, current.url),
    pages: pages,
    footers: pageJson.footer[lang],
    meta: current,
    prefetch: flickrImageList(),
    languages: langMeta,
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

// Navigation Timing API statistics to Keen.IO
app.post('/navigation-timings', function (req, res) {
  res.set({'Content-type': 'application/json'});
  res.send('Keen.IO - ' + req.body.url);
  keenSend('navigation timing', req.body);
});

// Resource Timing API statistics to Keen.IO
app.post('/resource-timings', function (req, res) {
  res.set({'Content-type': 'application/json'});
  res.send('Keen.IO - ' + req.body.url);

  // Entries are sent as string due to post data form
  req.body.entries = JSON.parse(req.body.entries);

  keenSend('resource timing', req.body);
});

// https://devcenter.heroku.com/articles/config-vars
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || null; // Heroku fails with non null address
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000;

// https://github.com/indutny/node-spdy
var spdyOptions = {
  //key: fs.readFileSync(__dirname + '/keys/spdy-key.pem'),
  //cert: fs.readFileSync(__dirname + '/keys/spdy-cert.pem'),
  //ca: [fs.readFileSync(__dirname + '/keys/spdy-ca-key.pem')],

  // **optional** SPDY-specific options
  //windowSize: 1024 * 1024, // Server's window size

  // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
  //autoSpdy31: false
};
//var server = spdy.createServer(spdyOptions, app);

app.listen(port, ipaddr, function () {
  console.log('Express.js running at http://' + ipaddr + ':' + port + '/');
});
