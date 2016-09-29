/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const fs = require('fs');
const contentPath = require('./content-path');

/**
 * List the alternative languages and their locations,
 * including the current location, as per Google spec.
 *
 * @see https://support.google.com/webmasters/answer/2620865
 * @param {object} list Page object that contain the matching locations
 * @param {array} enabledLanguages List of two char language codes of the enabled languages
 * @returns {array} List of objects, each having 'lang' and 'href' properties
 */
const listAlternates = function listAlternates(list, enabledLanguages) {
  const alternates = [];
  Object.keys(list).forEach(function eachKey(lang) {
    if (enabledLanguages.indexOf(lang) !== -1 && list[lang].url) {
      alternates.push({
        lang: lang,
        href: list[lang].url
      });
    }
  });

  return alternates;
};

/**
 * Format the page data to match the need for sitemap.
 *
 * @param {object} pages JSON data from content folder
 * @param {array} enabledLanguages List of two char language codes of the enabled languages
 * @returns {array} Data to be used with the sitemap template
 */
module.exports = function siteMap(pages, enabledLanguages) {
  const out = [];
  pages.forEach(function eachPage(item) {
    // Item should have three properties, indexed with language code
    Object.keys(item).forEach(function eachKey(lang) {
      if (enabledLanguages.indexOf(lang) !== -1 && item[lang].url) {
        const url = item[lang].url;
        const path = contentPath(lang, url);
        const stats = fs.statSync(path);
        if (stats.isFile()) {
          const date = stats.mtime.toISOString().split('T').shift();
          const data = {
            loc: url,
            lastmod: date,
            changefreq: 'monthly'
          };
          data.alternates = listAlternates(item, enabledLanguages);
          out.push(data);
        }
      }
    });
  });

  return out;
};
