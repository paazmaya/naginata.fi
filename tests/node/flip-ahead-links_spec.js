/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Check initial page language', function() {
  var flipAheadLinks = require('../../libs/flip-ahead-links');


  it('accepted languages has first matching the last enabled', function() {
    var output = flipAheadLinks(pages, current);
    expect(output.length).toBe(2);
    expect(output[0].rel).toBe('next');
    expect(output[1].rel).toBe('prev');
  });

});
