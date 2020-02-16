/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */



const fs = require('fs');
const childProcess = require('child_process');

/**
 * https://github.com/haydenbleasel/favicons
 * npm install favicons
 */
const favicons = require('favicons');

/**
 * https://github.com/donpark/html2jade
 * npm install html2jade
 */
const html2jade = require('html2jade');

const startTime = (new Date()).getTime();

const minifyPng = function () {
  // Minify
  const child = childProcess.execFile(
    'optipng',
    ['-o7', '../public_html/icons/*.png'],
    {
      cwd: '.'
    },
    function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    }
  );
};

// Convert HTML to Jade
const convertJade = function () {
  const html = fs.readFileSync('favicons.html', fsOpts);
  html2jade.convertHtml(html, {}, function (err, jade) {
    fs.writeFileSync('favicons.jade', jade, 'utf8');
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

    const seconds = Math.round(((new Date()).getTime() - startTime) / 100) / 10;
    console.log('Completed in ' + seconds + ' seconds. Thanks!');
  }
});
