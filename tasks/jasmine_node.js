/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = {
  node: {
    options: {
      coverage: {
        thresholds: {
          lines: 98
        },
        print: 'detail' // none, detail, both
      },
      specFolders: ['tests/node'],

      verbose: true,
      colors: true,

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

      collect: false // array of covPattern for finding files
    },
    src: [
      'server.js',
      'libs/*.js'
    ]
  }
};
