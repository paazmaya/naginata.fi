/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
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
        'public_html/js/analytics.js',
        'public_html/js/sendanmaki.js'
      ]
    }
  }
};
