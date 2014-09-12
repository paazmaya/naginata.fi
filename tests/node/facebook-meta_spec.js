/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Facebook OpenGraph crawler specific meta data', function() {
  var facebookMeta = require('../../libs/facebook-meta');

  it('accepted languages has first matching the last enabled', function() {
    var output = facebookMeta(page, fb);
    expect(output).toBe('ja');
  });

});
