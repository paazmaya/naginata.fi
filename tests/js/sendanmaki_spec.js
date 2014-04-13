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
  
  it('created image notes', function(done) {
    spyOn(sendanmaki, 'createImgNote');
    sendanmaki.buildImageNotes(url, sendanmaki.notes[url]);

    expect(sendanmaki.createImgNote).toHaveBeenCalled();
    
    // FIXME: These are failing for some reason...
    expect($('.note').length).toBe(9);
    expect($('.notearea').length).toBe(9);
    expect($('.notetext').length).toBe(9);
    done();
  });
  
  // TODO: notehover class comes available on hover and is removed 
});


// TODO: video click opens iframe

// TODO: figure click opens Flick image

// TODO: external links open new window

// TODO: cbox_complete sends Google Analytics

// TODO: modal Colorbox is closed

// TODO: Colorbox is localised in Finnish and Japanese

// TODO: When iframe is opened, its size is based on current screen size

describe('Window onLoad initiates Web Performance statistics', function() {
  var timerCallback;
  
  beforeEach(function(){
    timerCallback = jasmine.createSpy('timerCallback');
    jasmine.clock().install();
  });
  
  afterEach(function() {
    jasmine.clock().uninstall();
  });
  
  // TODO: window onload sets timeouts
  
});
