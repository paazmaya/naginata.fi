/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var _gaq = _gaq || [];
var sendanmaki = window.sendanmaki = {
  /**
   * Current page language.
   * Fetched from html lang attribute.
   */
  lang: 'fi',

  /**
   * Image notes for the given key image.
   */
  notes: {
    '/img/naginata-bogu-chudan-artwork-lecklin.png': [
      {
        width: 104,
        height: 126,
        x: 45,
        y: 0,
        note: 'Men'
      },
      {
        width: 58,
        height: 82,
        x: 147,
        y: 235,
        note: 'Kote'
      },
      {
        width: 83,
        height: 118,
        x: 55,
        y: 138,
        note: 'Do'
      },
      {
        width: 137,
        height: 87,
        x: 30,
        y: 246,
        note: 'Tare'
      },
      {
        width: 52,
        height: 133,
        x: 112,
        y: 435,
        note: 'Sune ate'
      },
      {
        width: 31,
        height: 39,
        x: 369,
        y: 236,
        note: 'Kissaki'
      },
      {
        width: 23,
        height: 25,
        x: 13,
        y: 252,
        note: 'Ishizuki'
      },
      {
        width: 48,
        height: 26,
        x: 251,
        y: 307,
        note: 'Sendanmaki'
      },

      {
        width: 39,
        height: 27,
        x: 352,
        y: 279,
        note: 'Monouchi'
      }
    ]
  },

  /**
   * This shall be run on domReady in order to initiate
   * all the handlers needed.
   */
  domReady: function () {
    sendanmaki.lang = $('html').attr('lang') || sendanmaki.lang;

    // Add notes to a chudan kamae bogu image, if available
    $.each(sendanmaki.notes, function (item) {
      $('img[src="' + item + '"]').each(function () {
        sendanmaki.createImgNote(sendanmaki.notes[item], item);
      }).on('mouseover mouseout', function (event) {
          //var data = $(this).data();

          var div = $(this).parent().children('div.note:contains("' +
                      sendanmaki.notes[item].note + '")');
          if (event.type === 'mouseover') {
            div.addClass('notehover');
          }
          else {
            div.removeClass('notehover');
          }

        });
    });

    // Nokia E7 browser fails on this...
    if (typeof window.applicationCache !== 'undefined') {
      window.applicationCache.addEventListener('updateready', function () {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
          // Browser downloaded a new app cache.
          // Swap it in and reload the page to get the new hotness.
          window.applicationCache.swapCache();
          if (window.confirm('A new version of this site is available. Load it?')) {
            location.reload();
          }
        }
      }, false);
    }

    // Re-usage
    var $media = $('article p > a:has(img:only-child), article.media ul a');
    var $external = $('a[href^="http://"], a[href^="https://"]').not($media);

    // external urls shall open in a new window
    $external.on('click', function (event) {
      event.preventDefault();
      var href = $(this).attr('href');
      window.open(href, $.now());
    });

    // Video links
    $('article.media ul:last-of-type a').on('click', function (event) {
      event.preventDefault();

      // Youtube
      // http://www.youtube.com/watch?v=[id]
      // http://www.youtube.com/embed/[id]?version=3&f=videos&app=youtube_gdata

      // Vimeo
      // http://vimeo.com/[id]
      // http://player.vimeo.com/video/[id]

      var href = $(this).attr('href');
      href = href.replace(/vimeo.com\/(\w+)/, 'player.vimeo.com/video/$1');
      href = href.replace(/youtube.com\/watch\?v=(\w+)/,
                          'youtube.com/embed/$1?version=3&f=videos&app=youtube_gdata');

      sendanmaki.openIframe(href, $(this).attr('title'));
    });

    // Thumbnail on all pages except media
    $('article p > a:has(img:only-child)').on('click', function (event) {
      event.preventDefault();
      var href = $(this).find('img').attr('src');

      // Find the domain
      if (href.search(/flickr\.com\//) !== -1) {
        // Flickr, replace _m.jpg --> _z.jpg
        href = href.replace('_m.jpg', '_z.jpg');
      }

      // Tell Analytics
      _gaq.push(['_trackPageview', href]);

      $.colorbox({
        title: $(this).attr('title'),
        href: href,
        photo: true
      });
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
        current: 'Kuva {current} / {total}',
        previous: 'Edellinen',
        next: 'Seuraava',
        close: 'Sulje',
        xhrError: 'Sisällön lataaminen epäonnistui.',
        imgError: 'Kuvan lataaminen epäonnistui.',
        slideshowStart: 'Aloita kuvaesitys.',
        slideshowStop: 'Lopeta kuvaesitys.'
      });
    }
    else if (sendanmaki.lang === 'ja') {
      /*
       jQuery Colorbox language configuration
       language: Japanaese (ja)
       translated by: Hajime Fujimoto
       */
      jQuery.extend(jQuery.colorbox.settings, {
        current: '{total}枚中{current}枚目',
        previous: '前',
        next: '次',
        close: '閉じる',
        xhrError: 'コンテンツの読み込みに失敗しました',
        imgError: '画像の読み込みに失敗しました',
        slideshowStart: 'スライドショー開始',
        slideshowStop: 'スライドショー終了'
      });
    }
    // data-photo-page ...
    $('article.media ul:first-of-type > li > a').colorbox({
      rel: 'several',
      photo: true
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
   * Open the given url in a Colorbox iFrame.
   * @param {string} url
   * @param {string} title
   */
  openIframe: function (url, title) {
    var w = $('#wrapper').width();
    var h = w * 0.75;

    // By using iframe, fullscreen becomes possible
    $.colorbox({
      title: title,
      innerHeight: h,
      innerWidth: w,
      href: url,
      iframe: true,
      scrolling: false
    });
  },

  /**
   * Create a note element on a image that has src == data.url
   * @param {object} data {x, y, width, height, note}
   */
  createImgNote: function (data, url) {
    var parent = $('img[src="' + url + '"]').parent();
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
