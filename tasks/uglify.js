/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = {
  javascript: {
    options: {
      banner: '<%= banner %>',
      preserveComments: 'some',
      sourceMap: false
    },
    files: {
      'public_html/js/naginata.min.js': [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/colorbox/jquery.colorbox.js',
        'public_html/js/analytics.js',
        'public_html/js/sendanmaki.js'
      ]
    }
  }
};
