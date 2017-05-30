/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const fs = require('fs');

// Custom classes
const app = require('./libs/express-app');
const checkLang = require('./libs/check-lang');
const getEnabledLanguages = require('./libs/get-enabled-languages');
const helpers = require('./libs/express-helpers');

const pageData = fs.readFileSync('./content/page-data.json', {
  encoding: 'utf8'
});
const pageJson = JSON.parse(pageData);

let langMeta = getEnabledLanguages(pageJson.languages); // Enabled language meta data, needed for language navigation
const langKeys = Object.keys(langMeta); // Enabled language ISO codes: en, fi, ...
let defaultLang = langKeys[0];

/*
const saveStaticFile = (url, lang, html) => {
  let filename = url.replace('/' + lang, '').replace('/', '');
  if (filename === '') {
    filename = 'index';
  }
  const targetfile = `public_html/${lang}/${filename}.html`;
  const targetdir = path.dirname(targetfile);
  if (!fs.existsSync(targetdir)) {
    fs.mkdirSync(targetdir);
  }
  fs.writeFileSync(targetfile, html, 'utf8');
};
*/

const pageRegex = new RegExp('^/(' + langKeys.join('|') + ')(/(\\w+))?$');
app.get(pageRegex, function appGetRegex(req, res) {
  const lang = req.params[0];
  app.set('lang', lang);

  let current = null;
  const currentLangPages = [];
  // Get the pages for the given language, in order to create navigation.
  pageJson.pages.forEach(function eachPage(item) {
    if (typeof item[lang] === 'object') {
      if (item[lang].url === req.path) {
        current = item[lang];
        current.view = item.en.title.toLowerCase();
        langMeta = helpers.linkPageLanguages(langMeta, item);
      }
      currentLangPages.push(item[lang]);
    }
  });

  if (typeof current !== 'object') {
    res.redirect('/' + lang);

    return;
  }

  current.titlesuffix = pageJson.title[lang];

  const indexData = function indexData() {
    const getContent = require('./libs/get-content');
    const flipAheadLinks = require('./libs/flip-ahead-links');
    const flickrImageList = require('./libs/flickr-image-list');

    const userAgent = req.header('user-agent');
    if (userAgent && userAgent.indexOf('facebookexternalhit') !== -1) {
      const facebookMeta = require('./libs/facebook-meta.js');
      current.facebook = facebookMeta(current, pageJson.facebook);
    }

    return {
      content: getContent(lang, current.url),
      pages: currentLangPages,
      flipahead: flipAheadLinks(currentLangPages, current),
      footers: pageJson.footer[lang],
      meta: current,
      prefetch: flickrImageList(),
      languages: langMeta,
      lang: lang
    };
  };

  const inputData = indexData();
  res.set(helpers.indexHeaders(lang));
  res.render('index', inputData, function rendered(error, html) {
    res.send(html);
    // saveStaticFile(current.url, lang, html);
  });
});

// Try to find the cause
app.get('/undefined', function appGetRoot(req, res) {
  const accepts = req.acceptsLanguages() || '';
  const check = checkLang(accepts, langKeys) || '';
  const def = defaultLang || '';
  const useragent = req.header('user-agent') || '';
  const error = {
    checkLang: check,
    acceptsLanguages: accepts,
    langKeys: langKeys,
    defaultLang: def,
    useragent: useragent
  };
  console.log('slash-undefined. error: ' + JSON.stringify(error));
  res.redirect('/en');
});

// Softer landing page
app.get('/', function appGetRoot(req, res) {
  const accepts = req.acceptsLanguages();
  console.log('just-slash. langKeys: ' + JSON.stringify(langKeys) +
    ', req.acceptsLanguages(): ' + JSON.stringify(accepts));
  defaultLang = checkLang(accepts, langKeys);
  res.redirect('/' + defaultLang);
});

// Catch anything that does not match the previous rules.
app.get('*', function appGetRest(req, res) {
  const accepts = req.acceptsLanguages();
  console.log('anything. langKeys: ' + JSON.stringify(langKeys) +
    ', req.acceptsLanguages(): ' + JSON.stringify(accepts));
  defaultLang = checkLang(accepts, langKeys);
  res.redirect('/' + defaultLang);
});

// https://devcenter.heroku.com/articles/config-vars
const port = process.env.PORT || 5000;

app.listen(port, function appListen() {
  console.log('server.js running at port: ' + port);
});
