/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

/**
 * Take a screen capture of each hover state and create a video of them
 *
 * ffmpeg -framerate 2 -i bogu-%02d.png -pix_fmt yuv420p -c:v libx264 -r 30 -g 1 bogu-hover.mp4
 */
const URL = 'https://naginata.fi/en/naginata';
const IMG = '/img/naginata-bogu-chudan-artwork-lecklin.png';

const casper = require('casper').create({
  verbose: true,
  logLevel: 'info',
  viewportSize: {
    width: 1024,
    height: 800
  }
});

casper.start(URL, function() {
  const bounds = this.evaluate(function(image) {
    return __utils__.getElementBounds('img[src="' + image + '"]');
  }, IMG);
  bounds.width += 50;
  this.capture('bogu-00.png', bounds);

  const spans = this.evaluate(function(image) {
    const parent = document.querySelector('img[src="' + image + '"]').parentNode;

    return parent.querySelectorAll('.note');
  }, IMG);
  this.capture('bogu-01.png', bounds);

  const ns = [];
  const len = spans.length;
  for (let i = 0; i < len; ++i) {
    let n = String(i + 2); // because img is the first
    if (n.length < 2) {
      n = '0' + n; // zero fill needed for FFmpeg
    }
    ns.push(n);
  }
  this.eachThen(ns, function (response) {
    const n = response.data;
    this.evaluate(function(n) {
      __utils__.mouseEvent('mouseover', '.note:nth-child(' + n + ')');
    }, n);

    this.capture('bogu-' + n + '.png', bounds);

    this.evaluate(function(n) {
      __utils__.mouseEvent('mouseout', '.note:nth-child(' + n + ')');
    }, n);
  });
});

casper.run();
