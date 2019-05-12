/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('ExpressJS content helpers', function() {
  const helpers = require('../../libs/express-helpers');

  it('Link to same content in other languages', function() {
    const output = helpers.linkPageLanguages({
      fi: {}
    }, {
      fi: {}
    });
    expect(output).not.toBe(undefined);
  });

  it('Additional headers', function() {
    const output = helpers.indexHeaders('fi');
    expect(output).not.toBe(undefined);
  });

});
