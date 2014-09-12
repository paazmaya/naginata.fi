/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Check initial page language', function() {
  var violation = require('../../libs/violation-report-receiver');


  it('accepted languages has first matching the last enabled', function() {
    var output = checkLang(acceptedLanguages, languages);
    expect(output).toBe('ja');
  });

});
