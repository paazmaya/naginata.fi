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
   * @param {string} key    Key which should be the img elements src
   * @param {Array}  items  Items to be created for the given key image
   */
  buildImageNotes: function (key, items) {
    var parent = $('img[src="' + key + '"]').parent().addClass('relative');
    $('img[src="' + key + '"]').each(function eachImage() {
      items.forEach(function forItems(data) {
        sendanmaki.createImgNote(data, key, parent);
      });
    });
    
    $(document).on('mouseover mouseout', '.note[rel]', function noteHover(event) {
      var cont = $(event.currentTarget);
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
   * @param {{x: number, y: number, width: number, height: number, note: string}} data Data for the note, such as position, size and text
   * @param {string} url  Src property of the img element for which the note is created
   */
  createImgNote: function (data, url, parent) {
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
   * @param {jQuery.Event} event Click event via jQuery
   */
  onVideoClick: function (event) {
    event.preventDefault();
    sendanmaki.openVideoLink($(this));
  },
  
  /**
   * @param {jQuery} $self The link that was clicked, which should have video page url
   */
  openVideoLink: function ($self) {
    var href = $self.attr('href');
    href = href.replace(/vimeo.com\/(\w+)/, 'player.vimeo.com/video/$1');
    href = href.replace(/youtube.com\/watch\?v=(\w+)/,
                      'youtube.com/embed/$1?version=3&f=videos&app=youtube_gdata');

    sendanmaki.openIframe(href, $self.attr('title'));
  },

  /**
   * @param {jQuery.Event} event Click event via jQuery
   */
  onFigureClick: function (event) {
    event.preventDefault();
    sendanmaki.openFlickrImage($(this));
  },
  
  /**
   * @param {jQuery} $self The link that was clicked, which should have Flickr image url
   */
  openFlickrImage: function ($self) {
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
    $external.on('click', function externalClick(event) {
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
    $(document).on('cbox_complete', function cboxComplete() {
      var href = $.colorbox.element().attr('href');
      if (href) {
        ga('send', 'pageview', href);
      }
    });

    // Close colorbox if opened as modal
    $(document).on('click', '#colorbox input[type="button"][name="close"]', function closeClick() {
      $.colorbox.close();
    });
  },

  /**
   * Set translation strings on Colorbox based on the current lang.
   */
  localiseColorbox: function () {

  console.log('this.lang: ' + this.lang);
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
   * @param {string} url   Url which should be opened
   * @param {string} title Title for the Colorbox
   */
  openIframe: function (url, title) {
    var w = $('div.centered').width() || 1000;
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
  }
};

(function jsLoaded() {
  sendanmaki.domReady();
})();
