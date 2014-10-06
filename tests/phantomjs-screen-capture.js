/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var page = require('webpage').create();

page.open('http://localhost:5000', function() {
  page.render('localhost-index.png');
  phantom.exit();
});
