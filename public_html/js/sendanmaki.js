/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * License: Attribution-ShareAlike 3.0 Unported
 *          http://creativecommons.org/licenses/by-sa/3.0/
 */

'use strict';

var sendanmaki = window.sendanmaki = {
  /**
   * Current page language.
   * Fetched from html lang attribute.
   */
  lang: 'fi',

  /**
   * Time between when Navigation and Resource Timing API data is being send
   * by the current user.
   * TODO: separate to per page and increase interval.
   */
  interval: 60 * 60 * 1000,

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
   * Add notes to a chudan kamae bogu image, if available.
   * @param {jQuery} item
   */
  buildImageNotes: function (key, items) {
    $('img[src="' + key + '"]').each(function () {
      items.forEach(function (data) {
        sendanmaki.createImgNote(data, key);
      });
    }).on('mouseover mouseout', function (event) {
        var cont = $(this).parent().children('span:contains("' + items.note + '")');
        if (event.type === 'mouseover') {
          cont.addClass('notehover');
        }
        else {
          cont.removeClass('notehover');
        }
      });
  },

  /**
   * Create a note element on a image that has src == data.url
   * @param {object} data {x, y, width, height, note}
   */
  createImgNote: function (data, url) {
    var parent = $('img[src="' + url + '"]').parent().css('position', 'relative');

    if (parent.length > 0 && $('span.note[rel="' + data.note + '"]').length === 0) {
      var cont = $('<span class="note" rel="' + data.note + '"></span>');
      cont.css('left', data.x).css('top', data.y);

      var area = $('<span class="notearea"></span>');
      area.css('width', data.width).css('height', data.height);

      var note = $('<span class="notetext">' + data.note + '</span>');
      cont.append(area, note);

      parent.append(cont).show();
    }
  },

  /**
   * Click handler for Media page video list.
   *
   * Converts the href value for iframe player version, as described below.
   *
   * Youtube
   * http://www.youtube.com/watch?v=[id]
   * http://www.youtube.com/embed/[id]?version=3&f=videos&app=youtube_gdata
   *
   * Vimeo
   * http://vimeo.com/[id]
   * http://player.vimeo.com/video/[id]
   *
   * @param {jQuery.Event} event
   */
  onVideoClick: function (event) {
    event.preventDefault();
    var $self = $(this);
    var href = $self.attr('href');
    href = href.replace(/vimeo.com\/(\w+)/, 'player.vimeo.com/video/$1');
    href = href.replace(/youtube.com\/watch\?v=(\w+)/,
                      'youtube.com/embed/$1?version=3&f=videos&app=youtube_gdata');

    sendanmaki.openIframe(href, $self.attr('title'));
  },

  /**
   * @param {jQuery.Event} event
   */
  onFigureClick: function (event) {
    event.preventDefault();
    var $self = $(this);
    var href = $self.find('img').attr('src');

    // Find the domain
    if (href.search(/flickr\.com\//) !== -1) {
      // Flickr, replace _m.jpg --> _z.jpg
      href = href.replace('_m.jpg', '_z.jpg');
    }

    // Tell Analytics
    ga('send', 'pageview', href);

    $.colorbox({
      title: $self.attr('title'),
      href: href,
      photo: true
    });
  },

  /**
   * This shall be run on domReady in order to initiate
   * all the handlers needed.
   */
  domReady: function () {
    this.lang = $('html').attr('lang') || this.lang;
    sendanmaki.localiseColorbox();

    $.each(this.notes, this.buildImageNotes);

    // Re-usage
    var $media = $('article p > a:has(img:only-child), article.media ul a');
    var $external = $('a[href^="http://"], a[href^="https://"]').not($media);

    // external urls shall open in a new window
    $external.on('click', function (event) {
      event.preventDefault();
      var href = $(this).attr('href');
      window.open(href, $.now());
    });

    // Thumbnail on all pages except media
    $('article p > a:has(img:only-child)').on('click', sendanmaki.onFigureClick);

    // Video links
    $('article.media ul:last-of-type a').on('click', sendanmaki.onVideoClick);

    // data-photo-page ...
    $('article.media ul:first-of-type > li > a').colorbox({
      rel: 'several',
      photo: true
    });

    // Track ColorBox usage with Google Analytics
    $(document).on('cbox_complete', function () {
      var href = $.colorbox.element().attr('href');
      if (href) {
        ga('send', 'pageview', href);
      }
    });

    // Close colorbox if opened as modal
    $(document).on('click', '#colorbox input[type="button"][name="close"]', function () {
      $.colorbox.close();
    });
  },

  /**
   * Set translation strings on Colorbox based on the current lang.
   */
  localiseColorbox: function () {

    // Colorbox translations
    if (this.lang === 'fi') {
      /*
       jQuery Colorbox language configuration
       language: Finnish (fi)
       translated by: Mikko
       */
      $.extend($.colorbox.settings, {
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
    else if (this.lang === 'ja') {
      /*
       jQuery Colorbox language configuration
       language: Japanaese (ja)
       translated by: Hajime Fujimoto
       */
      $.extend($.colorbox.settings, {
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
  },

  /**
   * Open the given url in a Colorbox iFrame.
   * @param {string} url
   * @param {string} title
   */
  openIframe: function (url, title) {
    var w = $('#wrapper').width() || 1000;
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
   * Send Navigation Timing API results to Keen.IO.
   *
   * @see http://www.w3.org/TR/navigation-timing/
   * @see http://caniuse.com/nav-timing
   */
  sendNavigationTimings: function () {
    if (typeof window.performance !== 'object' ||
        typeof window.performance.timing !== 'object') {
      return;
    }
    var data = {
      url: window.location.pathname,
      userAgent: window.navigator.userAgent
    };
    // navigationStart is the first event taking place in the PerformanceTiming sequence
    var navigationStart = window.performance.timing.navigationStart;
    // All the keys will be set to the relative time as it gives more value than the time.
    $.each(window.performance.timing, function (key, value) {
      if (typeof value === 'number') {
        // Value should be the time when the given event took place, 
        // but might be 0 if the event was not fired or was not completed.
        data[key] = value === 0 ? 0 : value - navigationStart;
      }
    });
    
    /*
    interface PerformanceNavigation {
      const unsigned short TYPE_NAVIGATE = 0;
      const unsigned short TYPE_RELOAD = 1;
      const unsigned short TYPE_BACK_FORWARD = 2;
      const unsigned short TYPE_RESERVED = 255;
      readonly attribute unsigned short type;
      readonly attribute unsigned short redirectCount;
    };
    */
    if (typeof window.performance.navigation === 'object') {
      var nav = window.performance.navigation;
      data.redirectCount = nav.redirectCount;
      data.navigationType = nav.type < 3 ? ['NAVIGATE', 'RELOAD', 'BACK_FORWARD'][nav.type] : nav.type;
    }
    
    var now = $.now();
    var earlier = window.localStorage.getItem('navTimeSent') || 0;

    if (now - earlier > sendanmaki.interval) {
      $.post('/navigation-timings', data, function () {
        window.localStorage.setItem('navTimeSent', now);
      });
    }
  },

  /**
   * Send Resource Timing API results to Keen.IO.
   *
   * Available perhaps in EI10 and Chrome 26...
   *
   * @see http://www.w3.org/TR/resource-timing
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=822480
   */
  sendResourceTimings: function () {
    if (typeof window.performance !== 'object' ||
        typeof window.performance.getEntriesByType !== 'function') {
      return;
    }
    var data = {
      url: window.location.pathname,
      userAgent: window.navigator.userAgent,
      entries: JSON.stringify(window.performance.getEntriesByType('resource'))
    };

    var now = $.now();
    var earlier = window.localStorage.getItem('resTimeSent') || 0;

    if (now - earlier > sendanmaki.interval) {
      $.post('/resource-timings', data, function () {
        window.localStorage.setItem('resTimeSent', now);
      });
    }
  }

};

(function () {
  sendanmaki.domReady();

  window.onload = function () {
    window.setTimeout(sendanmaki.sendNavigationTimings, 500);
    window.setTimeout(sendanmaki.sendResourceTimings, 1000);
  };
})();
