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
    map: true,
    processors: [
      require('autoprefixer-core')({
        browsers: 'last 3 versions, ie 8, ie 9'
      }).postcss,
      require('csswring').postcss
    ]
  },
  css: {
    src: [
      'public_html/css/colorbox.css', // Use custom styles, modified from example 2.
      'public_html/css/main.css'
    ]
  }
};
