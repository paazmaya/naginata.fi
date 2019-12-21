/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('ExpressJS application setup', function() {
  const app = require('../../lib/express-app');

  it('While in development, pretty print is true', function() {
    const output = app.locals.pretty;
    expect(output).toBe(true);
  });

});
