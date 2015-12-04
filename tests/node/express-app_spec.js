/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('ExpressJS application setup', function() {
  var app = require('../../libs/express-app');

  it('While in development, pretty print is true', function() {
    var output = app.locals.pretty;
    expect(output).toBe(true);
  });

});
