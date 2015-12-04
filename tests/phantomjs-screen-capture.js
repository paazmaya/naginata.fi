/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

var page = require('webpage').create();

page.open('http://localhost:5000', function() {
  page.render('localhost-index.png');
  phantom.exit();
});
