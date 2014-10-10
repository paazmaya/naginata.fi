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

  var acceptsLanguages;
  var enabledLanguages;

  it('Accepted languages has first matching item the last enabled', function() {
    acceptsLanguages = ['ja', 'en-GB;q=0.8', 'en;q=0.6', 'fi;q=0.4'];
    enabledLanguages = ['fi', 'en', 'ja'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja');
  });

  it('Accepted languages has first matching English', function() {
    acceptsLanguages = ['en-GB', 'en', 'fi'];
    enabledLanguages = ['fi', 'en', 'ja'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('en');
  });

  it('Finnish is found as the first item', function() {
    acceptsLanguages = ['fi', 'en'];
    enabledLanguages = ['fi', 'en', 'ja'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('fi');

    acceptsLanguages = ['fi', 'en'];
    enabledLanguages = ['en', 'ja'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('en');
  });

  it('Accepted languages do not contain any of the enabled languages', function() {
    acceptsLanguages = ['zn', 'ch'];
    enabledLanguages = ['fi', 'en', 'ja'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('fi'); // Should be first in the enabled list
  });

  it('Accepted languages is undefined', function() {
    acceptsLanguages = undefined;
    enabledLanguages = ['ja', 'en', 'fi'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja'); // Should be first in the enabled list
  });

  it('Accepted languages is a string', function() {
    acceptsLanguages = 'hi there sir';
    enabledLanguages = ['en', 'fi'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('en'); // Should be first in the enabled list
  });

  it('Accepted languages is null', function() {
    acceptsLanguages = null;
    enabledLanguages = ['ja', 'en', 'fi'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja'); // Should be first in the enabled list
  });

  it('Accepted languages is boolean true', function() {
    acceptsLanguages = true;
    enabledLanguages = ['it', 'fi'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('it'); // Should be first in the enabled list
  });

  it('Accepted languages contain non a-z characters', function() {
    acceptsLanguages = [/(abc)/, '^', '*', '%', '$$$$$$$$$$$', '###'];
    enabledLanguages = ['si', 'hr'];
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('si'); // Should be first in the enabled list
  });

  it('Enabled languages is boolean true', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = true;
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is boolean false', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = false;
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is a string', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = 'hello there';
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is an empty object', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = {};
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is undefined', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = undefined;
    var output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });
});
