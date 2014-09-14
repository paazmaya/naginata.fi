/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('CSP Violation report', function() {
  var violation = require('../../libs/violation-report-receiver');

  var postData = {
    "csp-report": {
      "document-uri": "http://naginata.fi/en/",
      "referrer": "",
      "blocked-uri": "http://example.com/css/style.css",
      "violated-directive": "style-src cdn.example.com",
      "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports",
    }
  };

  it('Calls callback with proper part of the given argument', function() {
    var listener = {
      callBack: function (stuff) {}
    };
    spyOn(listener, 'callBack');

    var output = violation(postData, listener.callBack);

    expect(listener.callBack).toHaveBeenCalled();
    expect(listener.callBack.mostRecentCall.args[0]).toEqual(postData['csp-report']);

  });

});
