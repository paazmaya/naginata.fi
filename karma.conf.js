module.exports = function(config) {
  config.set({
    files: [
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
      'progress',
      'coverage'
    ],
    preprocessors: {
      'public_html/js/sendanmaki.js': ['coverage']
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    }
  });
};