/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          https://creativecommons.org/licenses/by-sa/4.0/
 */


const fs = require('fs');
const path = require('path');

const swig = require('swig');

// Custom classes
const getEnabledLanguages = require('./lib/get-enabled-languages');
const getContent = require('./lib/get-content');
const flipAheadLinks = require('./lib/flip-ahead-links');
const flickrImageList = require('./lib/flickr-image-list');
const facebookMeta = require('./lib/facebook-meta.js');

const sitemap = require('./lib/sitemap');

// Page meta data
const pageData = require('./content/page-data.json');

// Enabled language meta data, needed for language navigation
const langMeta = getEnabledLanguages(pageData.languages);

const indexData = (current, pages, enabledLanguages, lang) => {
  current.facebook = facebookMeta(current, pageData.facebook);

  const currentLangPages = pages.map((page) => {
    return page[lang];
  });

  // Get the same URL in other languages, used for changing the language
  const otherLangUrls = Object.assign({}, langMeta);
  pages.forEach((page) => {
    if (page[lang] && page[lang].url === current.url) {
      // This is the correct page object
      enabledLanguages.forEach((key) => {
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

const saveStaticFile = (filepath, content) => {
  console.log(`Saving static file to "${filepath}"`);
  const targetdir = path.dirname(filepath);
  try {
    fs.accessSync(targetdir);
  }
  catch (error) {
    fs.mkdirSync(targetdir);
  }
  fs.writeFileSync(filepath, content, 'utf8');
};

const renderSitemap = (enabledLanguages) => {
  const data = sitemap(pageData.pages, enabledLanguages);
  const template = swig.compileFile('views/sitemap.html');
  const content = template({
    pages: data
  });
  const filepath = path.join(__dirname, 'public_html', 'sitemap.xml');
  saveStaticFile(filepath, content);
};

const renderPage = (current, inputData, lang) => {
  console.log(`Rendering page with URL "${current.url}"`);

  const template = swig.compileFile('views/index.html');
  const html = template(inputData);

  let filename = current.url.replace('/' + lang, '').replace('/', '').trim();
  if (filename === '') {
    filename = 'index';
  }
  const filepath = path.join(__dirname, 'public_html', lang, `${filename}.html`);

  saveStaticFile(filepath, html);
};

const iteratePages = (pages) => {
  console.log(`Going to iterate ${pages.length} pages`);

  // Enabled language ISO codes: en, fi, ...
  const enabledLanguages = Object.keys(langMeta);

  renderSitemap(enabledLanguages);

  pages.forEach((page) => {
    Object.keys(page)
      .filter((lang) => enabledLanguages.indexOf(lang) !== -1)
      .forEach((lang) => {
        // Pages only with enabled languages get here
        const langPage = page[lang];
        langPage.view = page.en.title.toLowerCase();
        langPage.titlesuffix = pageData.title[lang];

        const inputData = indexData(langPage, pages, enabledLanguages, lang);
        renderPage(langPage, inputData, lang);
      });
  });
};

iteratePages(pageData.pages);
