/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

describe('Naginata is in Finland', function() {

  it('should be known by everyone', function() {
    expect(true).toBe(true);
  });

  it('thus language should be Finnish by default', function() {
    expect(sendanmaki.lang).toBe('fi');
  });

});

describe('Image Notes', function() {
  var url = '/img/naginata-bogu-chudan-artwork-lecklin.png';

  beforeEach(function(){
    $('<div id="stuff"><div><p><img src="' + url + '"/></p></div></div>').appendTo('body');
  });

  afterEach(function(){
    $('#stuff').remove();
  });

  it('has image notes data', function() {
    expect(sendanmaki.notes[url].length).toBe(9);
  });

  it('has fixture in body', function() {
    expect($('#stuff').length).toBe(1);
    expect($('img[src="' + url + '"]').parent().length).toBe(1);
  });

  it('created image notes', function() {
    spyOn(sendanmaki, 'createImgNote').and.callThrough();
    sendanmaki.buildImageNotes(url, sendanmaki.notes[url]);

    expect(sendanmaki.createImgNote.calls.count()).toEqual(9);

    expect($('.note').length).toBe(9);
    expect($('.notearea').length).toBe(9);
    expect($('.notetext').length).toBe(9);
  });

  it('uses notehover class on hover interaction', function() {
    sendanmaki.buildImageNotes(url, sendanmaki.notes[url]);
    $('.note').first().trigger('mouseover');

    expect($('.note').first().hasClass('notehover')).toBe(true);

    $('.note').first().trigger('mouseout');

    expect($('.note').first().hasClass('notehover')).toBe(false);
  });
});


describe('Colorbox interactions', function() {
  var vimeoLink = '<a title="Ishujiai: Taisho - 5th Naginata World Championships / Vimeo - Juga Paazmaya" href="http://vimeo.com/50068282">Ishujiai: Taisho - 5th Naginata World Championships</a>';
  var vimeoPlayer = 'http://player.vimeo.com/video/50068282';

  var mediaGridLink = '<a title="2012-12-06 Himeji - Naginata taiso in Jukendo book" href="http://farm9.static.flickr.com/8362/8450641664_fea2b93757_z.jpg"><img alt="2012-12-06 Himeji - Naginata taiso in Jukendo&#10;book" src="http://farm9.static.flickr.com/8362/8450641664_fea2b93757_s.jpg"></a>';
  var flickrImage = 'http://farm9.static.flickr.com/8362/8450641664_fea2b93757_z.jpg';

  beforeEach(function(){
    window.ga = function (){};
  });

  it('video link opens iframe with Vimeo player URL', function() {
    spyOn(sendanmaki, 'openIframe').and.callThrough();
    sendanmaki.openVideoLink($(vimeoLink));
    expect(sendanmaki.openIframe).toHaveBeenCalledWith(vimeoPlayer,
      'Ishujiai: Taisho - 5th Naginata World Championships / Vimeo - Juga Paazmaya');
  });

  // TODO: check youtube URL

/*
  it('opening Flick m size image calls Google Analytics', function() {
    spyOn(window, 'ga');
    sendanmaki.openFlickrImage($(mediaGridLink));
    expect(window.ga).toHaveBeenCalledWith('send', 'pageview', flickrImage);
  });

*/
// TODO: cbox_complete sends Google Analytics

// TODO: modal Colorbox is closed

// TODO: Colorbox is localised in Finnish and Japanese
  // sendanmaki.lang = 'ja';
  // open colorbox
  // check close button text

// TODO: When iframe is opened, its size is based on current screen size

});

/*
// Needs to setup so that body is appended before sendanmaki.js is loaded
describe('Other interactions', function() {

  it('open an external link in a new window', function() {
    var href = 'http://jikishin-naginata.jp';
    var link = '<a href="' + href + '" class="external test-case-1"></a>';
    $('body').append(link);

    spyOn(window, 'open');
    $('a.external.test-case-1').click();
    expect(window.open)toHaveBeenCalledWith(href);
  });

});
*/
