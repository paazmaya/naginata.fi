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

// Dependencies for express
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var morgan = require('morgan'); // logger
var responseTime = require('response-time');

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
  var compress = require('compression');
  app.use(compress());
}

app.use(serveStatic(__dirname + '/public_html'));
app.use(morgan());
app.use(bodyParser());
app.use(responseTime());

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
 * @param {Array} acceptsLanguages
 * @see http://expressjs.com/api.html#req.acceptsLanguages
 */
var checkLang = function (acceptsLanguages) {
  acceptsLanguages.forEach(function (item) {
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
// TODO: express 4 uses :lang/:page style and params will be an object
app.get(pageRegex, function (req, res) {
  var lang = req.params[0];
  app.set('lang', lang);

  var current = null;
  var pages = [];
  // Get the pages for the given language, in order to create navigation
  pageJson.pages.forEach(function (item) {
    if (item[lang]) {
      if (item[lang].url === req.path) {
        current = item[lang];
        // Save the current page other languages
        for (var key in langMeta) {
          if (langMeta.hasOwnProperty(key) && item[key]) {
            langMeta[key].url = item[key].url;
          }
        }
      }
      pages.push(item[lang]);
    }
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
    var facebookMeta = require('./libs/facebookMeta.js');
    current.facebook = facebookMeta(current, pageJson.facebook);
  }
  
  // prev, next
  var index = pages.indexOf(current);
  var prev = index > 0 ? index - 1 : pages.length - 1;
  var next = index < pages.length - 1 ? index + 1 : 0;
  pages[prev].rel = 'prev';
  pages[next].rel = 'next';
  
  // Every visit writes analytics
  keenSend('page view', {
    url: req.originalUrl,
    acceptedLanguages: req.acceptsLanguages(),
    acceptedCharsets: req.acceptsCharsets()
  });

  // https://developer.mozilla.org/en-US/docs/Security/CSP/Using_Content_Security_Policy
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': 'default-src \'self\' ' +
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
  checkLang(req.acceptsLanguages());
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

app.listen(port, ipaddr, function () {
  console.log('Express.js running at http://' + ipaddr + ':' + port + '/');
});
