/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('ExpressJS content helpers', function() {
  var helpers = require('../../libs/express-helpers');

  it('Link to same content in other languages', function() {
    var output = helpers.linkPageLanguages({'fi': {}}, {'fi': {}});
    expect(output).not.toBe(undefined);
  });

  it('Additional headers', function() {
    var output = helpers.indexHeaders('fi');
    expect(output).not.toBe(undefined);
  });

});
