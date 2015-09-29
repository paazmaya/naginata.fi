/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = {
  options: {
    processors: [
      require('autoprefixer')({
        browsers: 'last 3 versions, ie 8, ie 9'
      }),
      require('csswring')
    ]
  },
  css: {
    src: 'public_html/css/naginata.css',
    dest: 'public_html/css/naginata.min.css'
  }
};
