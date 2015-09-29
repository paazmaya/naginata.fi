/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('CSP Violation report', function() {
  var violation = require('../../libs/violation-report-receiver');

  var postData;

  var headers = {
    'user-agent': 'Testing Agent'
  };

  beforeEach(function() {
    postData = {
      'csp-report': {
        'document-uri': 'http://naginata.fi/en/',
        'referrer': '',
        'source-uri': 'http://naginata.fi/css/main.css',
        'blocked-uri': 'http://naginata.com/css/style.css',
        'violated-directive': 'style-src cdn.example.com',
        'original-policy': 'default-src \'none\'; style-src cdn.example.com; report-uri /violation-report'
      }
    };
  });

  it('Returns false on non existing report', function() {
    var output = violation({}, headers);
    expect(output).toBe(false);
  });
  it('Returns false on non http blocked URI', function() {
    postData['csp-report']['blocked-uri'] = '';
    var output = violation(postData, headers);
    expect(output).toBe(false);
  });
  it('Returns false on non http source URI', function() {
    postData['csp-report']['source-uri'] = '';
    var output = violation(postData, headers);
    expect(output).toBe(false);
  });
  it('Returns expected user agent', function() {
    var output = violation(postData, headers);
    expect(output).not.toBe(false);
    expect(output['user-agent']).toBe('Testing Agent');
  });
  it('Returns no user agent if it not defined', function() {
    var output = violation(postData, {});
    expect(output).not.toBe(false);
    expect(output['user-agent']).toBeUndefined();
  });

});
