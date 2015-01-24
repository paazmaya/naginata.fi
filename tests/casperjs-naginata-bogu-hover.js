/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var casper = require('casper').create({
  verbose: true,
  logLevel: 'info',
  viewportSize: {
    width: 1024,
    height: 800
  }
});
var image = '/img/naginata-bogu-chudan-artwork-lecklin.png';

casper.start('http://naginata.fi/en/naginata', function() {
  var bounds = this.evaluate(function(image) {
    return __utils__.getElementBounds('img[src="' + image + '"]');
  }, image);
  bounds.width += 50;
  this.capture('bogu-01.png', bounds);
  
  var spans = this.evaluate(function(image) {
    var parent = document.querySelector('img[src="' + image + '"]').parentNode;
    return parent.querySelectorAll('.note');
  }, image);
  
  var ns = [];
  var len = spans.length;
  for (var i = 0; i < len; ++i) {
    var n = String(i + 2); // because img is the first
    if (n.length < 2) {
      n = '0' + n; // zero fill needed for FFmpeg
    }
    ns.push(n); 
  }
  this.eachThen(ns, function (response) {
    var n = response.data;
    this.evaluate(function(n) {
      __utils__.mouseEvent('mouseover', '.note:nth-child(' + n + ')');
    }, n);
    
    this.capture('bogu-' + n + '.png', bounds);
    
    this.evaluate(function(n) {
      __utils__.mouseEvent('mouseout', '.note:nth-child(' + n + ')');
    }, n);
  });
  phantom.exit();
});

casper.run();


