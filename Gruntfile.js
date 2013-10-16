/*global module:false*/
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
            'public_html/js/jquery.outerhtml.js',
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

    jshint: {
      onlymine: {
        src: [
          'Gruntfile.js',
          'public_html/js/sendanmaki.js'
        ],
        jshintrc: '.jshintrc'
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
            'bower_components/colorbox/jquery.colorbox.js',
            'public_html/js/jquery.outerhtml.js'
          ],
          specs: 'tests/js/sendanmaki_spec.js'
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('minify', ['uglify', 'cssmin']);
  grunt.registerTask('default', ['jshint', 'jasmine', 'minify']);
};
