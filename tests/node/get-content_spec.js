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

  it('Non existant file is reported to Newrelic', function() {
    global.newrelic = {
      noticeError: function () {}
    };
    spyOn(global.newrelic, 'noticeError');

    var output = getContent('fi', '/fi/ciao');
    expect(output).toContain('404');
    expect(global.newrelic.noticeError).toHaveBeenCalled();
  });

});
