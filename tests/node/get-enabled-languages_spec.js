/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Get enabled languages', function() {
  var getEnabledLanguages = require('../../libs/get-enabled-languages');

  var langConf = {
    'fi': {
      'enabled': true,
      'name': 'Suomi'
    },
    'en': {
      'enabled': true,
      'name': 'English'
    },
    'ja': {
      'enabled': true,
      'name': '日本語'
    }
  };

  it('All enabled as an object', function() {
    var output = getEnabledLanguages(langConf);
    var keys = Object.keys(output);
    expect(keys.length).toBe(3);
  });

  it('Only Finnish in an object', function() {
    langConf.en.enabled = false;
    langConf.ja.enabled = false;
    var output = getEnabledLanguages(langConf);
    var keys = Object.keys(output);
    expect(keys.length).toBe(1);
  });

  it('Nothing', function() {
    var output = getEnabledLanguages();
    var keys = Object.keys(output);
    expect(keys.length).toBe(0);
  });

  it('String instead of object', function() {
    var output = getEnabledLanguages('wrong thing');
    var keys = Object.keys(output);
    expect(keys.length).toBe(0);
  });

  it('Array instead of object', function() {
    var output = getEnabledLanguages(['wrong', 'thing']);
    var keys = Object.keys(output);
    expect(keys.length).toBe(0);
  });

});
