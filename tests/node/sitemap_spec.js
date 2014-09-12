/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Sitemap XML creation', function() {
  var sitemap = require('../../libs/sitemap');


  it('accepted languages has first matching the last enabled', function() {
    var output = sitemap(pageData);
    expect(output).toBe('ja');
  });

});
