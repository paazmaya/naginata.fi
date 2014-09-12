/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Content Markdown file mapping to page URL addresses', function() {
  var contentPath = require('../../libs/content-path');

  it('Finnish media page', function() {
    var output = contentPath('fi', '/fi/media');
    var expected = 'content/fi/media.md';
    expect(output).toBe(expected);
  });

  it('English front page', function() {
    var output = contentPath('en', '/en');
    var expected = 'content/en/index.md';
    expect(output).toBe(expected);
  });

  it('Japanese front page with trailing slash', function() {
    var output = contentPath('ja', '/ja/');
    var expected = 'content/ja/index.md';
    expect(output).toBe(expected);
  });

  it('Finnish language, but English naginata page URL', function() {
    var output = contentPath('fi', '/en/naginata');
    var expected = 'content/en/naginata.md';
    expect(output).toBe(expected);
  });
});
