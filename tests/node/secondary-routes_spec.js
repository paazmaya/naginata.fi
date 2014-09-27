/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Secondary routes', function() {
  var secondaryRoutes = require('../../libs/secondary-routes');


  it('Only Finnish', function() {
    var output = secondaryRoutes();
    var keys = Object.keys(output);
    expect(keys.length).toBe(1);
  });

});
