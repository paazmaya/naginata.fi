/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */

'use strict';

describe('List of Flickr images for prefetch meta elements', function() {
  const flickrImageList = require('../../lib/flickr-image-list');

  it('at least few Flickr images are found', function() {
    const output = flickrImageList();
    expect(output.length).toBeGreaterThan(2);
  });

});
