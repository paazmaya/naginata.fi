/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

// https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives
const directives = {
  'default-src': [
    '\'self\'',
    '*.vimeo.com',
    '*.youtube.com',
    'https://*.vimeo.com',
    'https://*.youtube.com',
    '*.google-analytics.com',
    '*.flickr.com',
    '*.staticflickr.com',
    '*.doubleclick.net'
  ],
  'report-uri': [
    '/violation-report'
  ],
  'style-src': [
    '\'self\'',
    '\'unsafe-inline\'',
    '*.googleapis.com',
    '*.googleusercontent.com',
    '*.gstatic.com'
  ],
  'script-src': [
    '\'self\'',
    '*.google-analytics.com',
    '*.newrelic.com',
    '*.nr-data.net',
    '\'unsafe-inline\'',
    '\'unsafe-eval\'' // needed for Ghostinspector New Relic code test
  ],
  'font-src': [
    '*.gstatic.com',
    '*.googleapis.com',
    '*.googleusercontent.com'
  ]
};

/**
 * Content Security Policy directives via header
 * @returns {string} CSP directives used in a header
 * @see https://developer.mozilla.org/en-US/docs/Security/CSP/Using_Content_Security_Policy
 */
module.exports = function contentPolicy() {
  var policy = '';
  Object.keys(directives).forEach(function eachDirective(key) {
    var rules = directives[key];
    policy += key + ' ' + rules.join(' ') + '; ';
  });
  return policy;
};
