/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

const fs = require('fs');

const getEnabledLanguages = require('./get-enabled-languages');

const pageData = fs.readFileSync('content/page-data.json', {
  encoding: 'utf8'
});
const pageJson = JSON.parse(pageData);

const langMeta = getEnabledLanguages(pageJson.languages); // Enabled language meta data, needed for language navigation
const langKeys = Object.keys(langMeta); // Enabled language ISO codes: en, fi, ...

/**
 * sitemap.org
 * @param {object} req Request
 * @param {object} res Response
 * @returns {void}
 */
const appGetSitemap = function appGetSitemap(req, res) {
  res.set({
    'Content-type': 'application/xml'
  });
  const sitemap = require('./sitemap.js');
  res.render('sitemap', {
    pages: sitemap(pageJson.pages, langKeys)
  }, function renderSitemap(error, html) {
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
const appPostViolation = function appPostViolation(req, res) {
  res.set({
    'Content-type': 'application/json'
  });
  if (typeof req.body === 'object') {
    const violation = require('./violation-report-receiver.js');
    const report = violation(req.body, req.headers);
    res.json({
      report: 'prosessed'
    });
  }
  else {
    res.json({
      report: 'failed'
    });
  }
};

/**
 * Handle every GET request and pass through if not using www.
 * @param {object} req Request
 * @param {object} res Response
 * @param {function} next Call next route handler
 * @returns {void}
 */
const appGetAll = function appGetAll(req, res, next) {
  if (req.hostname.match(/^www/) !== null) {
    const url = req.protocol + '://' + req.hostname.replace(/^www\./, '') + req.originalUrl;
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
