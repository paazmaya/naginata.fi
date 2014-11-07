/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var fs = require('fs');

var getEnabledLanguages = require('./get-enabled-languages');

var pageData = fs.readFileSync('content/page-data.json', {
  encoding: 'utf8'
});
var pageJson = JSON.parse(pageData);

var langMeta = getEnabledLanguages(pageJson.languages); // Enabled language meta data, needed for language navigation
var langKeys = Object.keys(langMeta); // Enabled language ISO codes: en, fi, ...

/**
 * sitemap.org
 * @param {object} req Request
 * @param {object} res Response
 * @returns {void}
 */
var appGetSitemap = function appGetSitemap(req, res) {
  res.set({'Content-type': 'application/xml'});
  var sitemap = require('./sitemap.js');
  res.render('sitemap', {
    pages: sitemap(pageJson.pages, langKeys)
  }, function renderSitemap(error, html) {
    if (error) {
      global.newrelic.noticeError('sitemap', error);
    }
    res.send(html);
  });
};

/**
 * Receive CSP violation report via POST Ajax submission
 * @param {object} req Request
 * @param {object} res Response
 * @returns {void}
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Using_CSP_violation_reports
 */
var appPostViolation = function appPostViolation(req, res) {
  res.set({'Content-type': 'application/json'});
  if (typeof req.body === 'object') {
    var violation = require('./violation-report-receiver.js');
    var report = violation(req.body, req.headers);
    if (report !== false) {
      global.newrelic.noticeError('CSP-policy-violation', report);
    }
    res.json({report: 'prosessed'});
  }
  else {
    res.json({report: 'failed'});
  }
};

/**
 * Handle every GET request and pass through if not using www.
 * @param {object} req Request
 * @param {object} res Response
 * @param {function} next Call next route handler
 * @returns {void}
 */
var appGetAll = function appGetAll(req, res, next) {
  if (req.host.match(/^www/) !== null) {
    var url = req.protocol + '://' + req.host.replace(/^www\./, '') + req.originalUrl;
    res.redirect(url);
  }
  else {
    next();
  }
};

module.exports = {
  getSitemap: appGetSitemap,
  postViolation: appPostViolation,
  appGetAll: appGetAll
};
