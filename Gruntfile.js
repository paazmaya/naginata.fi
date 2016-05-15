/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
'use strict';

module.exports = function gruntConf(grunt) {
  require('time-grunt')(grunt); // Must be first item
  require('jit-grunt')(grunt, {
    jasmine_node: 'grunt-jasmine-node-coverage'
  });

  var loadConfig = function loadConfig(path) {
    var list = {};
    var files = grunt.file.expand({cwd: path, filter: 'isFile'}, '*.js');
    files.forEach(function eachFile(option) {
      var key = option.replace(/\.js$/, '');
      list[key] = require(path + option);
    });
    return list;
  };

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      '<%= pkg.author.name %>; <%= pkg.license.type %> */\n'
  };

  grunt.config.init(config);
  grunt.config.merge(loadConfig('./tasks/'));

  grunt.registerTask('minify', ['uglify', 'concat', 'postcss']);
  grunt.registerTask('test', ['eslint', 'jasmine', 'jasmine_node']);
  grunt.registerTask('default', ['test', 'minify']);
};
