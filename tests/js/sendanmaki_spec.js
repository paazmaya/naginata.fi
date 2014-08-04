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

  it('thus language should be Finnish', function() {
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
  });
});


describe('Colorbox interactions', function() {
  var vimeoLink = '<a title="Ishujiai: Taisho - 5th Naginata World Championships / Vimeo - Juga Paazmaya" href="http://vimeo.com/50068282">Ishujiai: Taisho - 5th Naginata World Championships</a>';

  var mediaGridLink = '<a title="2012-12-06 Himeji - Naginata taiso in Jukendo book" href="http://farm9.static.flickr.com/8362/8450641664_fea2b93757_z.jpg"><img alt="2012-12-06 Himeji - Naginata taiso in Jukendo&#10;book" src="http://farm9.static.flickr.com/8362/8450641664_fea2b93757_s.jpg"></a>';

  beforeEach(function(){
    window.ga = function (){};
  });
  /*
  it('video list item click opens iframe', function() {
    spyOn(sendanmaki, 'openIframe');
    sendanmaki.openVideoLink($(vimeoLink));
    expect(sendanmaki.openIframe).toHaveBeenCalled();
  });

  it('opening Flick image calls Google Analytics', function() {
    spyOn(window, 'ga');
    sendanmaki.openFlickrImage($(mediaGridLink));
    expect(window.ga).toHaveBeenCalled();
  });
  */

// TODO: cbox_complete sends Google Analytics

// TODO: modal Colorbox is closed

// TODO: Colorbox is localised in Finnish and Japanese

// TODO: When iframe is opened, its size is based on current screen size

});

// TODO: external links open new window
