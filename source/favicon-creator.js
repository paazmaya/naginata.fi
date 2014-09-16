/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var fs = require('fs');
var childProcess = require('child_process');

/**
 * https://github.com/haydenbleasel/favicons
 * npm install favicons
 */
var favicons = require('favicons');

/**
 * https://github.com/donpark/html2jade
 * npm install html2jade
 */
var html2jade = require('html2jade');

var startTime = (new Date()).getTime();

var minifyPng = function () {
  // Minify
  var child = childProcess.execFile(
    'optipng',
    ['-o7', '../public_html/icons/*.png'],
    {cwd: '.'},
    function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    }
  );
};

// Convert HTML to Jade
var convertJade = function () {
  var fsOpts = {encoding: 'utf8'};
  var html = fs.readFileSync('favicons.html', fsOpts);
  html2jade.convertHtml(html, {}, function (err, jade) {
    fs.writeFileSync('favicons.jade', jade, fsOpts);
  });
};

favicons({
    // I/O
    source: 'naginata-icon.svg',
    dest: '../public_html/icons',

    // Icon Types
    android: true,
    apple: true,
    coast: true,
    favicons: true,
    firefox: true,
    windows: true,

    // Miscellaneous
    html: 'favicons.html',
    background: '#072434',
    tileBlackWhite: false,
    manifest: false,
    trueColor: true,
    logging: true,
    callback: function () {

      minifyPng();

      // Move ico file
      fs.renameSync('../public_html/icons/favicon.ico', '../public_html/favicon.ico');

      convertJade();

      var seconds = Math.round(((new Date()).getTime() - startTime) / 100) / 10;
      console.log('Completed in ' + seconds + ' seconds. Thanks!');
    }
});