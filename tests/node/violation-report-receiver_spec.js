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
      "document-uri": "://naginata.fi/en/",
      "referrer": "",
      "blocked-uri": "http://example.com/css/style.css",
      "violated-directive": "style-src cdn.example.com",
      "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports",
    }
  };

  it('Returns false on non http document URI', function() {


    var output = violation(postData);

    expect(output).toBe(false);

  });

});
