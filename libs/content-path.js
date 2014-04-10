/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';


/**
 * Build the path for accessing content Markdown file.
 */
module.exports = function (lang, url) {
  url = url.replace('/' + lang, '').replace('/', '');
  if (url === '') {
    url = 'index';
  }
  return 'content/' + lang + '/' + url + '.md';
};
