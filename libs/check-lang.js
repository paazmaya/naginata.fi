/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

/**
 * Checks if the current language should be changed according to the
 * current users language preferences and thus changes if needed.
 * @param {Array} acceptsLanguages The languages accepted by the current user agent
 * @param {Array} enabledLanguages Languages enabled in the configuration, such as ["fi", "en", "ja"]
 * @see http://expressjs.com/api.html#req.acceptsLanguages
 * @returns {string} Two character language code, such as "fi", "en", or "ja"
 */
module.exports = function checkLang(acceptsLanguages, enabledLanguages) {
  if (!acceptsLanguages) {
    return enabledLanguages.shift();
  }
  for (var i = 0; i < acceptsLanguages.length; ++i) {
    var key = acceptsLanguages[i].substr(0, 2);
    if (enabledLanguages.indexOf(key) !== -1) {
      return key;
    }
  }
  return enabledLanguages.shift();
};
