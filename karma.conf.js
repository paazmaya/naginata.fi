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
      //'Chrome',
      //'Firefox',
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
      'progress',
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
