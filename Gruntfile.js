/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      '<% pkg.author.name %>; Licensed Attribution-ShareAlike 3.0 Unported */\n',

    uglify: {
      javascript: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'public_html/js/naginata.min.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/colorbox/jquery.colorbox.js',
            'public_html/js/analytics.js',
            'public_html/js/sendanmaki.js'
          ]
        }
      }
    },

    cssmin: {
      css: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'public_html/css/naginata.min.css': [
            'public_html/css/colorbox.css', // Use custom styles, modified from example 2.
            'public_html/css/main.css'
          ]
        }
      }
    },

    eslint: {
      options: {
        config: 'eslint.json'
      },
      target: [
        'Gruntfile.js',
        'karma.conf.js',
        'server.js',
        'public_html/js/analytics.js',
        'public_html/js/sendanmaki.js'
      ]
    },

    jscs: {
      onlymine: {
        options: {
          config: '.jscs.json'
        },
        files: {
          src: '<%= eslint.target %>'
        }
      }
    },

    jasmine: {
      public: {
        src: [
          'public_html/js/sendanmaki.js'
        ],
        options: {
          vendor: [
            'bower_components/jquery/jquery.js',
            'bower_components/colorbox/jquery.colorbox.js'
          ],
          specs: 'tests/js/sendanmaki_spec.js'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs-checker');

  grunt.registerTask('minify', ['uglify', 'cssmin']);
  grunt.registerTask('test', ['eslint', 'jscs', 'jasmine']);
  grunt.registerTask('default', ['test', 'minify']);
};
