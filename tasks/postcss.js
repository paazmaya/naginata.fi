/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = {
  options: {
    processors: [
      require('autoprefixer-core')({
        browsers: 'last 3 versions, ie 8, ie 9'
      }).postcss,
      require('csswring').postcss
    ]
  },
  css: {
    src: 'public_html/css/naginata.css',
    dest: 'public_html/css/naginata.min.css'
  }
};
