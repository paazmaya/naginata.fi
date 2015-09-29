/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = {
  frontend: {
    src: [
      'public_html/js/sendanmaki.js'
    ],
    options: {
      vendor: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/colorbox/jquery.colorbox.js'
      ],
      specs: 'tests/js/sendanmaki_spec.js',
      display: 'full'
    }
  }
};
