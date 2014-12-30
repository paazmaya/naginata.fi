/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

/**
 * Get only the enabled languages from the page data language object.
 * @param {object} languages List of languages from the page-data.json file
 * @returns {object} Only those languages that are enabled
 */
module.exports = function getEnabledLanguages(languages) {
  if (typeof languages !== 'object' || languages instanceof Array) {
    return {};
  }
  var list = {};
  Object.keys(languages).forEach(function forMetaLangs(key) {
    if (key.length === 2 && languages[key].enabled === true) {
      list[key] = languages[key];
    }
  });
  return list;
};
