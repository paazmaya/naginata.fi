/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

/**
 * Format the page data to match the need for sitemap.jade
 */
module.exports = function (pages) {
  var out = [];
  pages.forEach(function (item) {
    Object.keys(item).forEach(function (lang) {
      if (item[lang].url) {
        var file = 'content/' + item[lang].url + '.md';
        out.push({
          loc: item[lang].url,
          lastmod: '2013-10-08',
          changefreq: 'monthly'
        });
      }
    });
  });
  return out;
};