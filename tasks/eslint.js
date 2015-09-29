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
    config: '.eslintrc',
    format: 'stylish'
  },
  target: [
    'Gruntfile.js',
    'tasks/*.js',
    'karma.conf.js',
    'server.js',
    'libs/*.js',
    'public_html/js/analytics.js',
    'public_html/js/sendanmaki.js'
  ]
};
