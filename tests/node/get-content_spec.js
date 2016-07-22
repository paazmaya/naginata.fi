/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Get page content', function() {
  var getContent = require('../../libs/get-content');

  it('Build path to content file', function() {
    var output = getContent('fi', '/fi');
    expect(output.substr(0, 3)).toBe('<h2');
  });

});
