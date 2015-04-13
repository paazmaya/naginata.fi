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
    banner: '<%= banner %>'
  },
  css: {
    src: [
      'public_html/css/colorbox.css', // Use custom styles, modified from example 2.
      'public_html/css/main.css'
    ],
    dest: 'public_html/css/naginata.css'
  }
};
