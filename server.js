/** naginata.fi **/

// http://expressjs.com
var express = require('express');
var fs = require('fs');
var md = require('marked').parse;

var pageData = fs.readFileSync('page-data.json', { encoding: 'utf8' });
var pageJson = JSON.parse(pageData);


var app = express();
app.use(express.logger());
//app.use(express.compress());
app.use(express.static(__dirname + '/public_html'));

app.engine('jade', require('jade').__express);

app.set('titlesuffix', 'Naginata Suomessa');

app.set('views', __dirname);
app.set('view engine', 'jade');

var languages = {
  en: 'english',
  fi: 'finnish',
  ja: 'japanese'
};
var defaultLang = 'fi';

app.get(/^\/(fi|en|ja)(\/(\w+))?$/, function(req, res) {
  var lang = req.params[0];
  app.set('lang', lang);
  console.log('params: ' + req.params);
  var language = languages[lang];

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

  // Content will be current.title

  var file = 'grading-rules-' + (language || 'english') + '.md'
  var data = fs.readFileSync(file, { encoding: 'utf8' });
  var html = md(data);
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
