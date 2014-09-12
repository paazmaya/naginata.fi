/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Check initial page language', function() {
  var checkLang = require('../../libs/check-lang');

  var langConf = {
    "fi": {
      "enabled": false,
      "name": "Suomi"
    },
    "en": {
      "enabled": true,
      "name": "English"
    },
    "ja": {
      "enabled": true,
      "name": "日本語"
    }
  };
  var acceptedLanguages = ['ja', 'en-GB;q=0.8', 'en;q=0.6', 'fi;q=0.4'];

  it('accepted languages has first matching the last enabled', function() {
    var output = checkLang(acceptedLanguages, langConf);
    expect(output).toBe('ja');
  });

});
