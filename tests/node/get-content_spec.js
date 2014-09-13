/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Get page content', function() {
  var getContent = require('../../libs/get-content');

  it('build path to content file', function() {
    var output = getContent('fi', '/fi');
    expect(output.substr(0, 4)).toBe('<h1>');
  });


});
