/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Content Security Policy directives', function() {
  var contentPolicy = require('../../libs/content-policy-directives');

  it('Has default-src directive', function() {
    var output = contentPolicy();
    expect(output).toContain('default-src ');
  });

  it('Has report-uri directive', function() {
    var output = contentPolicy();
    expect(output).toContain('report-uri ');
  });

  it('Has style-src directive', function() {
    var output = contentPolicy();
    expect(output).toContain('style-src ');
  });

  it('Has script-src directive', function() {
    var output = contentPolicy();
    expect(output).toContain('script-src ');
  });

  it('Has font-src directive', function() {
    var output = contentPolicy();
    expect(output).toContain('font-src ');
  });
});
