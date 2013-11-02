/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = function(config) {
  config.set({
    files: [
      'bower_components/jquery/jquery.js',
      'bower_components/colorbox/jquery.colorbox.js',
      'public_html/js/sendanmaki.js',
      'tests/js/*.js'
    ],
    basePath: './',
    browsers: [
      'PhantomJS'
    ],
    frameworks: [
      'jasmine'
    ],
    logLevel: config.LOG_DISABLE,
    loggers: [
      {type: 'console'}
    ],
    reporters: [
      'coverage'
    ],
    preprocessors: {
      'public_html/js/sendanmaki.js': ['coverage']
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    singleRun: true
  });
};


