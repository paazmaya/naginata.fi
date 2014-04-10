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
 */
module.exports = function (pageData) {
  var out = [];
  pageData.pages.forEach(function (item) {
    Object.keys(item).forEach(function (lang) {
      if (pageData.languages[lang].enabled === true && item[lang].url) {
        var url = item[lang].url;
        var path = contentPath(lang, url);
        var stats = fs.statSync(path);
        if (stats.isFile()) {
          var date = stats.mtime.toISOString().split('T').shift();
          out.push({
            loc: item[lang].url,
            lastmod: date,
            changefreq: 'monthly'
          });
        }
      }
    });
  });
  return out;
};