/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var fs = require('fs');
var contentPath = require('./content-path');

/**
 * Format the page data to match the need for sitemap.jade
 * @param {object} pages JSON data from content folder
 * @param {array} enabledLanguages List of two char language codes of the enabled languages
 * @returns {array} Data used with sitemap Jade template
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
          data.alternates = (function (list, current) {
            var alternatives = [];
            Object.keys(item).forEach(function eachKey(lang) {
              if (lang !== current && enabledLanguages.indexOf(lang) !== -1 && item[lang].url) {
                alternatives.push({
                  lang: lang,
                  href: item[lang].url
                });
              }
            });
            return alternatives;
          }(item, lang));
          out.push(data);
        }
      }
    });
  });
  return out;
};
