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
const getEnabledLanguages = require('./libs/get-enabled-languages');
const getContent = require('./libs/get-content');
const flipAheadLinks = require('./libs/flip-ahead-links');
const flickrImageList = require('./libs/flickr-image-list');
const facebookMeta = require('./libs/facebook-meta.js');

// Page meta data
const pageData = require('./content/page-data.json');

// Enabled language meta data, needed for language navigation
const langMeta = getEnabledLanguages(pageData.languages);

// Enabled language ISO codes: en, fi, ...
const langKeys = Object.keys(langMeta);

const indexData = (current, pages, lang) => {
  current.facebook = facebookMeta(current, pageData.facebook);

  // Get the pages for the current language, used for navigation
  const currentLangPages = [];

  langKeys.forEach(key => {
    pages.forEach(page => {
      if (page[key] && key === lang) {
        currentLangPages.push(page[key]);
      }
    });
  });

  // Get the same URL in other languages, used for changing the language
  const otherLangUrls = Object.assign({}, langMeta);
  pages.forEach(page => {
    if (page[lang] && page[lang].url === current.url) {
      // This is the correct page object
      langKeys.forEach(key => {
        otherLangUrls[key].url = page[key].url;
      });
    }
  });

  return {
    content: getContent(lang, current.url),
    pages: currentLangPages,
    flipahead: flipAheadLinks(currentLangPages, current),
    footers: pageData.footer[lang],
    meta: current,
    prefetch: flickrImageList(),
    languages: Object.assign({}, langMeta, otherLangUrls),
    lang: lang
  };
};

const saveStaticFile = (url, lang, html) => {
  let filename = url.replace('/' + lang, '').replace('/', '').trim();
  if (filename === '') {
    filename = 'index';
  }
  const filepath = path.join('public_html', lang, `${filename}.html`);
  const targetdir = path.dirname(filepath);
  if (!fs.existsSync(targetdir)) {
    fs.mkdirSync(targetdir);
  }
  fs.writeFileSync(filepath, html, 'utf8');
};

const renderPage = (current, pages, lang) => {

  const inputData = indexData(current, pages, lang);

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
        const langPage = page[lang];
        langPage.view = page.en.title.toLowerCase();
        langPage.titlesuffix = pageData.title[lang];

        renderPage(langPage, pages, lang);
      });
  });
};
iteratePages(pageData.pages, langKeys);
