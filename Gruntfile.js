/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          https://creativecommons.org/licenses/by-sa/4.0/
 */

module.exports = function gruntConf(grunt) {
  require('jit-grunt')(grunt);

  const config = {
    pkg: grunt.file.readJSON('package.json')
  };

  grunt.config.init(config);
  grunt.config.merge({
    uglify: {
      javascript: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */\n',
          preserveComments: 'some',
          sourceMap: false
        },
        files: {
          'public_html/js/naginata.min.js': [
            'public_html/js/analytics.js',
            'public_html/js/sendanmaki.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('default', ['uglify']);
};
