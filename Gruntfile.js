/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */
'use strict';

module.exports = function gruntConf(grunt) {
  require('time-grunt')(grunt); // Must be first item
  require('jit-grunt')(grunt, {
    'jasmine_node': 'grunt-jasmine-node-coverage'
  });

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
          banner: '<%= banner %>',
          preserveComments: 'some',
          sourceMap: false
        },
        files: {
          'public_html/js/naginata.min.js': [
            'bower_components/jquery/dist/jquery.js',
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
        config: 'eslint.json',
        format: 'stylish'
      },
      target: [
        'Gruntfile.js',
        'karma.conf.js',
        'server.js',
        'libs/*.js',
        'public_html/js/analytics.js',
        'public_html/js/sendanmaki.js'
      ]
    },

    trimtrailingspaces: {
      javascript: {
        src: [
          '<%= eslint.target %>'
        ]
      }
    },

    jasmine: {
      frontend: {
        src: [
          'public_html/js/sendanmaki.js'
        ],
        options: {
          vendor: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/colorbox/jquery.colorbox.js'
          ],
          specs: 'tests/js/sendanmaki_spec.js',
          display: 'full'
        }
      }
    },

    jasmine_node: {
      coverage: true,
      options: {
        //specFolders: 'tests/node/',
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
    },

    watch: {
      scripts: {
        files: ['public_html/js/sendanmaki.js', '*.js'],
        tasks: ['eslint', 'uglify'],
        options: {
          interrupt: true
        }
      },
      styles: {
        files: ['public_html/css/main.css', 'public_html/css/colorbox.css'],
        tasks: ['cssmin']
      },
      jasmine: {
        files: ['tests/js/*.js'],
        tasks: ['jasmine:frontend']
      }
    }
  });

  grunt.registerTask('minify', ['uglify', 'cssmin']);
  grunt.registerTask('test', ['eslint', 'jasmine', 'jasmine_node']);
  grunt.registerTask('default', ['test', 'minify']);
};
