/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Check initial page language', function() {
  const checkLang = require('../../libs/check-lang');

  let acceptsLanguages;
  let enabledLanguages;

  it('Accepted languages has first matching item the last enabled', function() {
    acceptsLanguages = ['ja', 'en-GB;q=0.8', 'en;q=0.6', 'fi;q=0.4'];
    enabledLanguages = ['fi', 'en', 'ja'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja');
  });

  it('Accepted languages has first matching English', function() {
    acceptsLanguages = ['en-GB', 'en', 'fi'];
    enabledLanguages = ['fi', 'en', 'ja'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
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
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('fi'); // Should be first in the enabled list
  });

  it('Accepted languages is an array containing a star', function() {
    acceptsLanguages = ['*'];
    enabledLanguages = ['ja', 'en', 'fi'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja'); // Should be first in the enabled list
  });

  it('Accepted languages is undefined', function() {
    acceptsLanguages = undefined;
    enabledLanguages = ['ja', 'en', 'fi'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja'); // Should be first in the enabled list
  });

  it('Accepted languages is a string', function() {
    acceptsLanguages = 'hi there sir';
    enabledLanguages = ['en', 'fi'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('en'); // Should be first in the enabled list
  });

  it('Accepted languages is null', function() {
    acceptsLanguages = null;
    enabledLanguages = ['ja', 'en', 'fi'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('ja'); // Should be first in the enabled list
  });

  it('Accepted languages is boolean true', function() {
    acceptsLanguages = true;
    enabledLanguages = ['it', 'fi'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('it'); // Should be first in the enabled list
  });

  it('Accepted languages contain non a-z characters', function() {
    acceptsLanguages = [/(abc)/, '^', '*', '%', '$$$$$$$$$$$', '###'];
    enabledLanguages = ['si', 'hr'];
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('si'); // Should be first in the enabled list
  });

  it('Enabled languages is boolean true', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = true;
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is boolean false', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = false;
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is a string', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = 'hello there';
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is an empty object', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = {};
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });

  it('Enabled languages is undefined', function() {
    acceptsLanguages = ['it', 'fi'];
    enabledLanguages = undefined;
    const output = checkLang(acceptsLanguages, enabledLanguages);
    expect(output).toBe('no');
  });
});
