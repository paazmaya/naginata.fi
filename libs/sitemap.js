/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var fs = require('fs');
var contentPath = require('./content-path');

/**
 * List the alternative languages and their locations,
 * including the current location, as per Google spec.
 *
 * @see https://support.google.com/webmasters/answer/2620865
 * @param {object} list Page object that contain the matching locations
 * @param {array} enabledLanguages List of two char language codes of the enabled languages
 * @returns {array} List of objects, each having 'lang' and 'href' properties
 */
var listAlternates = function listAlternates(list, enabledLanguages) {
  var alternates = [];
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
  var out = [];
  pages.forEach(function eachPage(item) {
    // Item should have three properties, indexed with language code
    Object.keys(item).forEach(function eachKey(lang) {
      if (enabledLanguages.indexOf(lang) !== -1 && item[lang].url) {
        var url = item[lang].url;
        var path = contentPath(lang, url);
        var stats = fs.statSync(path);
        if (stats.isFile()) {
          var date = stats.mtime.toISOString().split('T').shift();
          var data = {
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
