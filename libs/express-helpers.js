/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';


/**
 * Insert a link to the other language page for the same content
 *
 * @param {object} langMeta Meta data for all pages
 * @param {object} item Single page item
 * @returns {object} langMeta that has additional url properties
 */
var linkPageLanguages = function linkPageLanguages(langMeta, item) {
  var langKeys = Object.keys(langMeta);

  // Save the current page other languages
  langKeys.forEach(function eachMetaLang(key) {
    if (item[key]) {
      langMeta[key].url = item[key].url;
    }
  });

  return langMeta;
};

/**
 * Additional headers for the content pages
 *
 * @param {string} lang Current language of the page
 * @returns {object} Header data to be passed to 'res.set()' method
 */
var indexHeaders = function indexHeaders(lang) {
  var contentPolicy = require('./content-policy-directives');
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': contentPolicy(),
    'Content-Language': lang,
    'Accept-Ranges': 'bytes',
    'Timing-Allow-Origin': '*'
  };
};


module.exports = {
  linkPageLanguages: linkPageLanguages,
  indexHeaders: indexHeaders
};
