/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

module.exports = {
  'pages': {
    'crawl': 'http://localhost:5000/fi'
  },
  'headers': {
    'Accept-Language': 'ja-JP'
  },
  'css': [
    'public_html/css/naginata.min.css'
  ],
  'whitelist': [
    // Image notes
    '.note',
    '.note:hover .notetext',
    '.notehover .notetext',
    '.note:hover .notearea',
    '.notehover .notearea',
    '.notearea',
    '.notetext',

    // jQuery.colorbox
    '#cboxOverlay',
    '#cboxWrapper',
    '#colorbox',

    // Hidden due to translations missing
    'html[lang=ja]'
  ]
};
