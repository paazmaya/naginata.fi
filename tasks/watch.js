/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
'use strict';

module.exports = {
  scripts: {
    files: ['public_html/js/sendanmaki.js', '*.js'],
    tasks: ['eslint', 'uglify'],
    options: {
      interrupt: true
    }
  },
  styles: {
    files: ['public_html/css/main.css', 'public_html/css/colorbox.css'],
    tasks: ['concat', 'postcss']
  },
  jasmine: {
    files: ['tests/js/*.js'],
    tasks: ['jasmine:frontend']
  }
};
