/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

/**
 * Validates the report, thus checks certain properties and their valuaes.
 * @param {object} report Violation report posted by user agent
 * @returns {boolean} False is not what expected
 */
var validateReport = function validateReport(report) {
  if (typeof report !== 'object') {
    return false;
  }
  if (typeof report['blocked-uri'] !== 'string' || report['blocked-uri'].indexOf('http://') !== 0) {
    return false;
  }
  if (typeof report['source-uri'] !== 'string' || report['source-uri'].indexOf('http://') !== 0) {
    return false;
  }
  /*
  if (typeof report.document_uri !== 'string' || report.document_uri.indexOf('naginata.fi') !== -1) {
    return false;
  }
  */
  return true;
};

/**
 * Simply just pass the possible violation report to the callback.
 *
 * The report is usually something like this
 * {
 *   "csp-report": {
 *     "document-uri": "http://naginata.fi/en/",
 *     "referrer": "",
 *     "blocked-uri": "http://example.com/css/style.css",
 *     "violated-directive": "style-src cdn.example.com",
 *     "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /violation-report",
 *   }
 * }
 *
 * @param {object} postData JSON data from browser
 * @param {object} headers Stuff
 * @returns {boolean|object} Report or false
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_CSP_violation_reports
 * @see http://www.w3.org/TR/CSP/#violation-reports
 */
module.exports = function violation(postData, headers) {
  var report = {};
  var valid = validateReport(postData['csp-report']);
  if (valid) {
    report = postData['csp-report'];
    if (typeof headers === 'object' && headers['user-agent']) {
      report['user-agent'] = headers['user-agent'];
    }
  }
  return valid ? report : false;
};
