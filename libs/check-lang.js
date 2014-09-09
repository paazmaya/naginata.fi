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
 * @param {Array} siteLanguages Languages listed in the configuration
 * @see http://expressjs.com/api.html#req.acceptsLanguages
 * @returns {?} Nothing
 */
module.exports = function checkLang(acceptsLanguages, siteLanguages) {
  var defaultLang = 'fi';
  for (var i = 0; i < acceptsLanguages.length; ++i) {
    var key = acceptsLanguages[i].substr(0, 2);
    if (siteLanguages.hasOwnProperty(key) &&
        siteLanguages[key].enabled === true) {
      return key;
    }
  }
  return defaultLang;
};
