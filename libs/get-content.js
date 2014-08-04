/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var fs = require('fs');

// https://github.com/chjj/marked
var marked = require('marked');
var md = marked.parse;
marked.setOptions({
  gfm: true,
  breaks: false
});

/**
 * Build the path for accessing content Markdown file.
 * @param {string} lang Two character ISO language code, such as 'fi' or 'en'
 * @param {string} url Url string that should match the content file
 * @returns {string} Path to the given content file
 */
var contentPath = function contentPath(lang, url) {
  url = url.replace('/' + lang, '').replace('/', '');
  if (url === '') {
    url = 'index';
  }
  return 'content/' + lang + '/' + url + '.md';
};

/**
 * Get the contents of the current page in HTML format.
 * @param {string} lang ISO 2 char language code
 * @param {string} url Page URL, including the language
 * @returns {string} HTML content
 */
module.exports = function getContent(lang, url) {
  var data = '# 404';
  var path = contentPath(lang, url);
  if (fs.existsSync(path)) {
    data = fs.readFileSync(path, {
      encoding: 'utf8'
    });
  }
  else {
    global.newrelic.noticeError('Given path does not exist: ' + path);
  }
  return md(data);
};
