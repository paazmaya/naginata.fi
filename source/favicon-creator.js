/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

/**
 * https://github.com/haydenbleasel/favicons
 * npm install favicons
 */
var favicons = require('favicons');

favicons({
    // I/O
    source: 'naginata-icon.svg',
    dest: 'icons',

    // Icon Types
    android: true,
    apple: true,
    coast: true,
    favicons: true,
    firefox: true,
    windows: true,

    // Miscellaneous
    html: null,
    background: '#121212',
    tileBlackWhite: false,
    manifest: false,
    trueColor: true,
    logging: true,
    callback: function () {
      console.log('Something done...');
    }
});