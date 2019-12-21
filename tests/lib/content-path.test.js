/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('Content Markdown file mapping to page URL addresses', function() {
  const contentPath = require('../../lib/content-path');

  it('Finnish media page', function() {
    const output = contentPath('fi', '/fi/media');
    const expected = 'content/fi/media.md';
    expect(output).toBe(expected);
  });

  it('English front page', function() {
    const output = contentPath('en', '/en');
    const expected = 'content/en/index.md';
    expect(output).toBe(expected);
  });

  it('Japanese front page with trailing slash', function() {
    const output = contentPath('ja', '/ja/');
    const expected = 'content/ja/index.md';
    expect(output).toBe(expected);
  });

  it('Finnish language, but English naginata page URL', function() {
    const output = contentPath('fi', '/en/naginata');
    const expected = 'content/en/naginata.md';
    expect(output).not.toBe(expected);
  });
});
