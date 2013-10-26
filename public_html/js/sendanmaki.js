/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License http://creativecommons.org/licenses/by-sa/3.0/
 *
 * sendanmaki.js
 *
 * Contains:
 *   Google Analytics
 *   Sendanmaki
 */
'use strict';

// -- Google Analytics for naginata.fi --
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2643697-14']);
_gaq.push(['_setSiteSpeedSampleRate', 10]);
_gaq.push(['_setDomainName', 'naginata.fi']);
_gaq.push(['_trackPageview']);

// http://code.google.com/apis/analytics/docs/gaJS/gaJSApiBasicConfiguration.html

(function () {
  if (location.host === 'naginata.fi') { // only at production...
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  }
})();
// -- Enough about Google Analytics --


var sendanmaki = {
  /**
   * Current page language.
   * Fetched from html lang attribute.
   */
  lang: 'fi',

  /**
   * This shall be run on domReady in order to initiate
   * all the handlers needed.
   */
  domReady: function () {
    // When was the current page content last modified
    //var modified = $('article').data('dataModified');

    sendanmaki.lang = $('html').attr('lang');


    // Add notes to a chudan kamae bogu image, if available
    // /img/naginata-bogu-chudan-artwork-lecklin.png
    $('.hasnotes li').each(function () {
      var data = $(this).data();
      if (typeof data !== 'undefined') {
        sendanmaki.createImgNote(data);
      }
    }).on('mouseover mouseout', function (event) {
        var data = $(this).data();

        if (data.url && data.note) {
          var div = $('img[src="' + data.url + '"]').parent().children('div.note:contains("' + data.note + '")');
          if (event.type == 'mouseover') {
            div.addClass('notehover');
          }
          else {
            div.removeClass('notehover');
          }
        }
      });

    // Nokia E7 browser fails on this...
    if (typeof applicationCache !== 'undefined') {
      applicationCache.addEventListener('updateready', function (e) {
        if (applicationCache.status == applicationCache.UPDATEREADY) {
          // Browser downloaded a new app cache.
          // Swap it in and reload the page to get the new hotness.
          applicationCache.swapCache();
          if (confirm('A new version of this site is available. Load it?')) {
            location.reload();
          }
        }
        else {
          // Manifest didn't changed. Nothing new to server.
          //console.log('applicationCache.status when updateready event occurred: ' + applicationCache.status);
        }
      }, false);
    }


    // Reusage
    var $images = $('p > a:has(img:only-child)');
    var $external = $('a[href^="http://"],a[href^="https://"]').not($images);

    // external urls shall open in a new window
    $external.on('click', function (event) {
      event.preventDefault();
      var href = $(this).attr('href');
      window.open(href, $.now());
    });

    // href has link to actual page, rel has inline player link
    $images.on('click', function (event) {
      event.preventDefault();
      console.log(this);
      sendanmaki.mediaThumbClick($(this));
    });

  },

  initColorbox: function () {

    // Colorbox translations
    if (sendanmaki.lang === 'fi') {
      /*
       jQuery Colorbox language configuration
       language: Finnish (fi)
       translated by: Mikko
       */
      jQuery.extend(jQuery.colorbox.settings, {
        current: "Kuva {current} / {total}",
        previous: "Edellinen",
        next: "Seuraava",
        close: "Sulje",
        xhrError: "Sisällön lataaminen epäonnistui.",
        imgError: "Kuvan lataaminen epäonnistui.",
        slideshowStart: "Aloita kuvaesitys.",
        slideshowStop: "Lopeta kuvaesitys."
      });
    }
    else if (sendanmaki.lang === 'ja') {
      /*
       jQuery Colorbox language configuration
       language: Japanaese (ja)
       translated by: Hajime Fujimoto
       */
      jQuery.extend(jQuery.colorbox.settings, {
        current: "{total}枚中{current}枚目",
        previous: "前",
        next: "次",
        close: "閉じる",
        xhrError: "コンテンツの読み込みに失敗しました",
        imgError: "画像の読み込みに失敗しました",
        slideshowStart: "スライドショー開始",
        slideshowStop: "スライドショー終了"
      });
    }
    // data-photo-page ...
    $('.imagelist a').colorbox({
      rel: 'several'
    });

    // Track ColorBox usage with Google Analytics
    $(document).on('cbox_complete', function () {
      var href = $.colorbox.element().attr('href');
      if (href) {
        _gaq.push(['_trackPageview', href]);
      }
    });

    // Close colorbox if opened as modal
    $(document).on('click', '#colorbox input[type="button"][name="close"]', function () {
      $.colorbox.close();
    });
  },

  /**
   * Handle a click on a media thumbnail.
   * It can be a Flickr image, Vimeo or Youtube video.
   * @param {jQuery} $a
   */
  mediaThumbClick: function ($a) {
    var data = $a.data();
    var href = $a.attr('href');

    // Find the domain
    if (href.search(/\/\/.*flickr\.com\//) !== -1) {

    }

    // Flickr, replace _m.jpg --> _z.jpg

    // Tell Analytics
    _gaq.push(['_trackPageview', href]);

    if (data.iframe) {
      // Vimeo has size data, Youtube does not
      var w = $('#wrapper').width();
      var h = w * 0.75;
      if (data.width) {
        w = data.width;
      }
      if (data.height) {
        h = data.height;
      }

      // By using iframe, fullscreen becomes possible
      $.colorbox({
        title: $a.attr('title'),
        innerHeight: h,
        innerWidth: w,
        href: data.url,
        iframe: true,
        scrolling: false
      });
    }
    else {
      $.colorbox({
        title: $a.attr('title'),
        href: data.url,
        photo: true
      });
    }
  },

  /**
   * Create a note element on a image that has src == data.url
   * @param {object} data {x, y, width, height, note, url}
   */
  createImgNote: function (data) {
    var parent = $('img[src="' + data.url + '"]').parent();
    var existing = $('div.note[rel="' + data.note + '"]').size();
    if (parent.size() > 0 && existing === 0) {
      var div = $('<div class="note" rel="' + data.note + '"></div>');
      var tpo = parent.position();
      div.css('left', data.x + tpo.left).css('top', data.y + tpo.top);
      var area = $('<span class="notearea"></span>');
      var note = $('<span class="notetext">' + data.note + '</span>');
      area.css('width', data.width).css('height', data.height);
      div.append(area, note);
      parent.append(div).show();
    }
  }
};


(function () {
  sendanmaki.domReady();
  sendanmaki.initColorbox();
})();
