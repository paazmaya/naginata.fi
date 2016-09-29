/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
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
  const list = {};
  Object.keys(languages).forEach(function forMetaLangs(key) {
    if (key.length === 2 && languages[key].enabled === true) {
      list[key] = languages[key];
    }
  });

  return list;
};
