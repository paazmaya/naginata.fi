/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

/**
 * Build the path for accessing content Markdown file.
 * @param {string} lang Two character ISO language code, such as 'fi' or 'en'
 * @param {string} url Url string that should match the content file
 * @returns {string} Path to the given content file
 */
module.exports = function contentPath(lang, url) {
  url = url.replace('/' + lang, '').replace('/', '');
  if (url === '') {
    url = 'index';
  }
  return 'content/' + lang + '/' + url + '.md';
};
