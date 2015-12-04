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

// https://github.com/chjj/marked
const marked = require('marked');

var md = marked.parse;
marked.setOptions({
  gfm: true,
  breaks: false
});

/**
 * Get the contents of the current page in HTML format.
 * @param {string} lang ISO 2 char language code
 * @param {string} url Page URL, including the language
 * @returns {string} HTML content
 */
module.exports = function getContent(lang, url) {
  var data = '## 404';
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
