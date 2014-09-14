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

  it('Accepted languages has first matching item the last enabled', function() {
    var output = checkLang(['ja', 'en-GB;q=0.8', 'en;q=0.6', 'fi;q=0.4'], langConf);
    expect(output).toBe('ja');
  });

  it('Accepted languages has first matching English', function() {
    langConf.fi.enabled = true;
    var output = checkLang(['en-GB', 'en', 'fi'], langConf);
    expect(output).toBe('en');
  });

  it('Finnish is found as the first item', function() {
    langConf.fi.enabled = true;
    var output = checkLang(['fi', 'en'], langConf);
    expect(output).toBe('fi');

    langConf.fi.enabled = false;
    var output = checkLang(['fi', 'en'], langConf);
    expect(output).toBe('en');
  });

  it('Accepted languages do not containany of the enabled languages', function() {
    langConf.fi.enabled = true;
    var output = checkLang(['zn', 'ch'], langConf);
    expect(output).toBe('fi');
  });
});
