/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const fs = require('fs');
const path = require('path');

const swig = require('swig');

// Custom classes
const app = require('./libs/express-app');
const getEnabledLanguages = require('./libs/get-enabled-languages');
const helpers = require('./libs/express-helpers');
const getContent = require('./libs/get-content');
const flipAheadLinks = require('./libs/flip-ahead-links');
const flickrImageList = require('./libs/flickr-image-list');
const facebookMeta = require('./libs/facebook-meta.js');

// Page meta data
const pageData = require('./content/page-data.json');

const indexData = (current, pages, lang) => {
  current.facebook = facebookMeta(current, pageData.facebook);

  return {
    content: getContent(lang, current.url),
    pages: pages,
    flipahead: flipAheadLinks(pages, current),
    footers: pageData.footer[lang],
    meta: current,
    prefetch: flickrImageList(),
    languages: langMeta,
    lang: lang
  };
};

const saveStaticFile = (url, lang, html) => {
  let filename = url.replace('/' + lang, '').replace('/', '').trim();
  if (filename === '') {
    filename = 'index';
  }
  const targetfile = path.join('public_html', lang, `${filename}.html`);
  const targetdir = path.dirname(targetfile);
  if (!fs.existsSync(targetdir)) {
    fs.mkdirSync(targetdir);
  }
  fs.writeFileSync(targetfile, html, 'utf8');
};

const renderPage = (current, pages, lang) => {

  const inputData = indexData(current, pages, lang);
  res.set(helpers.indexHeaders(lang));

  const template = swig.compileFile('views/index.html');
  const html = template(inputData);

  saveStaticFile(current.url, lang, html);
};

/**
 * @param {object} pages
 * @param {array} enabledLanguages
 */
const iteratePages = (pages, enabledLanguages) => {

  pages.forEach(page => {
    Object.keys(page)
      .filter(lang => enabledLanguages.indexOf(lang) !== -1)
      .forEach(lang => {
        app.set('lang', lang);
        const langPage = page[lang];
        langPage.view = page.en.title.toLowerCase();
        langPage.titlesuffix = pageData.title[lang];
        langMeta = helpers.linkPageLanguages(langMeta, page);

        renderPage(langPage, pages, lang);
      });
  });
};

const langMeta = getEnabledLanguages(pageData.languages); // Enabled language meta data, needed for language navigation
const langKeys = Object.keys(langMeta); // Enabled language ISO codes: en, fi, ...
iteratePages(pageData.pages, langKeys);
