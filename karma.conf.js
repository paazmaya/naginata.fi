/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

module.exports = function karmaConf(config) {
  config.set({
    autoWatch: false,
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jquery-colorbox/jquery.colorbox.js',
      'public_html/js/sendanmaki.js',
      'tests/js/*.js'
    ],
    basePath: './',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    logLevel: config.LOG_INFO,
    loggers: [
      {
        type: 'console'
      }
    ],
    reporters: ['coverage'],
    preprocessors: {
      'public_html/js/sendanmaki.js': ['coverage']
    },
    plugins: ['karma-*'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    singleRun: true
  });
};
