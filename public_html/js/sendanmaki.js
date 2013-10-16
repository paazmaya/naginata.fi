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
  if (location.port != 8802) { // that is my development server...
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
   * Keep alive interval.
   * 1000 * 60 * 4 ms = 4 minutes
   */
  keepAliveInt: (60000 * 4),

  /**
   * This shall be run on domReady in order to initiate
   * all the handlers needed.
   */
  domReady: function () {
    // When was the current page content last modified
    //var modified = $('article').data('dataModified');

    sendanmaki.lang = $('html').attr('lang');

    // Add notes to a chudan kamae bogu image, if available
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

    // external urls shall open in a new window
    $('a[href^="http://"],a[href^="https://"]').not('.mediathumb a, .imagelist a').on('click',function (event) {
      event.preventDefault();
      var href = $(this).attr('href');
      window.open(href, $.now());
    });

    // href has link to actual page, rel has inline player link
    $('.mediathumb a:has(img)').on('click',function (event) {
      event.preventDefault();
      sendanmaki.mediaThumbClick($(this));
    });

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

    // Keep session alive and update login status
    setInterval(function () {
      sendanmaki.keepAlive();
    }, sendanmaki.keepAliveInt);
    sendanmaki.keepAlive();
  },

  /**
   * Keep PHP session alive and get the current login status
   */
  keepAlive: function () {
    var data = {};
    $.post('/keep-session-alive', data, function (received, status) {
      if (received.answer != 'offline') {
        sendanmaki.isLoggedIn = received.login;
        sendanmaki.userEmail = received.email;
      }

      if (sendanmaki.isLoggedIn) {
        $('a[href="#contribute"]').text('Muokkaa');
      }

    }, 'json');
  },

  /**
   * Handle a click on a media thumbnail.
   * It can be a Flickr image, Vimeo or Youtube video.
   * @param {jQuery} $a
   */
  mediaThumbClick: function ($a) {
    var data = $a.data();

    // Tell Analytics
    _gaq.push(['_trackPageview', $a.attr('href')]);

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
   * @param {object} data {x, y, width, heigth, note, url}
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
})();
