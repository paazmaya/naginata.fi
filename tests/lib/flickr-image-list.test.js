/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <paazmaya@yahoo.com>
 * License: Attribution-ShareAlike 4.0 Unported
 *          http://creativecommons.org/licenses/by-sa/4.0/
 */
import flickrImageList from '../../lib/flickr-image-list';

describe('List of Flickr images for prefetch meta elements', function() {

  it('at least few Flickr images are found', function() {
    const output = flickrImageList();
    expect(output.length).toBeGreaterThan(2);
  });

});
