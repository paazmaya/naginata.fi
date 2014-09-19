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
    config: 'eslint.json',
    format: 'stylish'
  },
  target: [
    'Gruntfile.js',
    'karma.conf.js',
    'server.js',
    'libs/*.js',
    'public_html/js/analytics.js',
    'public_html/js/sendanmaki.js'
  ]
};
