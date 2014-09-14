/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

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
 *     "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports",
 *   }
 * }
 *
 * @param {object} postData JSON data from browser
 * @param {function} callBack Function to be called with two parameters, report and output
 * @returns {void} Nothing
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_CSP_violation_reports
 * @see http://www.w3.org/TR/CSP/#violation-reports
 */
module.exports = function violation(postData, callBack) {
  var output = {
    violated: 'Thanks!'
  };
  var report = {};
  if (postData.hasOwnProperty('csp-report') && typeof postData['csp-report'] === 'object') {
    report = postData['csp-report'];
  }
  if (typeof callBack === 'function') {
    callBack.call(this, report, output);
  }
};
