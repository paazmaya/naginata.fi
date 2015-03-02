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
          lines: 90
        },
        reportDir: 'istanbul/stuff/',
        print: 'detail' // none, detail, both
      },
      specFolders: ['tests/node'],

      isVerbose: true,
      showColors: true,

      forceExit: true,
      match: '.',
      matchAll: false,
      specNameMatcher: '_spec',
      extensions: 'js',
      // captureExceptions: true,
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
