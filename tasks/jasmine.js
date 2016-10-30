/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

module.exports = {
  frontend: {
    src: [
      'public_html/js/sendanmaki.js'
    ],
    options: {
      vendor: [
        'node_modules/jquery/dist/jquery.js',
        'node_modules/jquery-colorbox/jquery.colorbox.js'
      ],
      specs: 'tests/js/sendanmaki_spec.js',
      display: 'full'
    }
  }
};
