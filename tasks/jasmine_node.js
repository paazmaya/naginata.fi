/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = {
  coverage: true,
  specFolders: ['tests/node'],
  options: {
    isVerbose: true,
    showColors: true,

    forceExit: true,
    match: '',
    matchall: false,
    specNameMatcher: '_spec',
    extensions: 'js',
    //captureExceptions: true,
    jUnit: {
      report: false,
      savePath: './reports/',
      useDotNotation: true,
      consolidate: true
    },

    print: 'detail', // none, detail, both
    //excludes: [],
    collect: null // array of covPattern for finding files
  }
};
