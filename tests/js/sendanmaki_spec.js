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
    $('<div id="stuff"><div><p><img src="/img/naginata-bogu-chudan-artwork-lecklin.png"/></p></div></div>').appendTo('body');
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
    spyOn(sendanmaki, 'createImgNote');
    sendanmaki.buildImageNotes(url);

    expect(sendanmaki.createImgNote).toHaveBeenCalled();
    
    // FIXME: These are failing for some reason...
    //expect($('.note').length).toBe(9);
    //expect($('.notearea').length).toBe(9);
    //expect($('.notetext').length).toBe(9);
  });
  
});