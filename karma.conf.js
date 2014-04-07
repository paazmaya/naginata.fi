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
    autoWatch: false,
    files: [
      'bower_components/jquery/dist/jquery.js',
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
    logLevel: config.LOG_DEBUG,
    loggers: [
      {type: 'console'}
    ],
    reporters: [
      'coverage'
    ],
    preprocessors: {
      'public_html/js/sendanmaki.js': ['coverage']
    },
    plugins: [
      'karma-*'
    ],
    coverageReporter: {
      type: 'lcovonly',
      dir: 'coverage/'
    },
    singleRun: true
  });
};
