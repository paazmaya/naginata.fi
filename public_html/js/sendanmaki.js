/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * sendanmaki.js
 *
 * Contains:
 *   Google Analytics
 *   Sendanmaki
 *   Modernizr statistics
 */

// -- Google Analytics for naginata.fi --
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2643697-14']);
_gaq.push(['_setSiteSpeedSampleRate', 10]);
_gaq.push(['_trackPageview']);

// http://code.google.com/apis/analytics/docs/gaJS/gaJSApiBasicConfiguration.html

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
// -- Enought about Google Analytics --


// Run all client side preparation once DOM is ready.
$(document).ready(function() {
    sendanmaki.domReady();

	// Do not run the Modernizr stats immediately.
    mdrnzr.once = setInterval(function() {
		mdrnzr.checkUpdate();
    }, 1200);
});


var sendanmaki = {
    /**
     * Is the user logged in to the backend?
     * The initial value is in footer data.
     */
    isLoggedIn: 0,

    /**
     * Email address of the current user against OpenID.
     * Initial value from footer data.
     */
    userEmail: '',

    /**
     * Edit mode can be triggered once logged in.
     * If it is on, clicking the children of article will open
     * edit form in colorbox for that element.
     * Initial value is fetched from localStorage.
     */
    editMode: 0,

    /**
     * Unix time stamp of the moment when the content shown
     * on the site was last modified. This infrmation is
     * available in footer data.
     */
    dataModified: 0,

	/**
	 * Current page language.
	 * Fetched from html lang attribute.
	 */
	lang: 'fi',

	/**
	 * Keep alive interval.
	 * 1000 * 60 * 3 ms = 3 minutes
	 */
	keepAlive: (60000 * 3),

    /**
     * This shall be run on domReady in order to initiate
     * all the handlers needed.
     */
    domReady: function() {
        var fData = $('footer').data();
        sendanmaki.isLoggedIn = fData.isLoggedIn;
        sendanmaki.userEmail = fData.userEmail;
        sendanmaki.dataModified = fData.dataModified;

		sendanmaki.lang = $('html').attr('lang');
		
		console.log('applicationCache.status: ' + sendanmaki.appCacheStat());
		
		applicationCache.addEventListener('updateready', function(e) {
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
			}
		}, false);

		// external urls shall open in a new window
        $('article a[href~="http://"]:not(.mediathumb a, .imagelist a)').click(function() {
            var href = $(this).attr('href');
            window.open(href, $.now());
            return false;
        });

		// href has link to actual page, rel has inline link
        $('.mediathumb a:has(img)').click(function() {
			sendanmaki.mediaThumbClick($(this));
			return false;
		});
		$('.imagelist a').colorbox({
			rel: 'several'
		});

        // Track ColorBox usage with Google Analytics
        $(document).on('cbox_complete', function() {
            var href = $.colorbox.element().attr("href");
            if (href) {
                _gaq.push(['_trackPageview', href]);
            }
        });

        // Open modal form for logging in via OpenID
        $('a[href="#contribute"]').click(function() {
            if (sendanmaki.isLoggedIn) {
                // toggle edit mode
                sendanmaki.editModeToggle();
            }
            else {
                // open login form
                sendanmaki.openLoginForm();
            }
            return false;
        });

        // Logged in can most likely edit content, thus AJAX.
        $('#colorbox form.edit').live('submit', function() {
            if (sendanmaki.isLoggedIn) {
                sendanmaki.submitEditForm($(this));
                return false;
            }
        });

        // Close colorbox if opened as modal
        $('#colorbox input[type="button"][name="close"]').live('click', function() {
            $.colorbox.close();
        });

        // Might want to check that the editor is not open...
		$(window).on('beforeunload', function() {
			if (sendanmaki.editMode) {
                //console.log('beforeunload');
                //return false;
			}
		});

		// Finally check if div#logo data is set. It is used only for messaging
		var success = $('#logo').data('msgLoginSuccess'); // 1 or 0
		if (typeof success !== 'undefined') {
			sendanmaki.showAppMessage(success ? 'loginSuccess' : 'loginFailure');
		}

		// Inline edit links
		if (sendanmaki.isLoggedIn) {
            // Initial value once page is loaded
            sendanmaki.editMode = (localStorage.getItem('editMode') == 1) ? 1 : 0;
            if (sendanmaki.editMode) {
                // handle hover via css...
                $('article').addClass('editmode');
                $('a[href="#contribute"]').addClass('editmode');
            }
			/*
            $('.editmode > *:not(.mediathumb, .imagelist)').live('mouseover', function() {
				$(this).addClass('edithover');
            }).live('mouseout', function() {
				$(this).removeClass('edithover');
            });
			*/
			$('.editmode > *:not(.mediathumb, .imagelist)').live('click', function() {
				$(this).removeClass('edithover');
                sendanmaki.editModeClick($(this));
            });
		}

        // So sad, but in 2012 there still needs to be a keep alive call
        setInterval(function() {
            $.post('/keep-session-alive', {foo: 'bar'}, function(received, status) {
                console.log(received.answer); // seconds
            }, 'json');
        }, sendanmaki.keepAlive);
    },

	/**
	 * http://www.html5rocks.com/en/tutorials/appcache/beginner/
	 */
	appCacheStat: function() {
		var ac = window.applicationCache;

		switch (ac.status) {
			case ac.UNCACHED: // UNCACHED == 0
				return 'UNCACHED';
				break;
			case ac.IDLE: // IDLE == 1
				return 'IDLE';
				break;
			case ac.CHECKING: // CHECKING == 2
				return 'CHECKING';
				break;
			case ac.DOWNLOADING: // DOWNLOADING == 3
				return 'DOWNLOADING';
				break;
			case ac.UPDATEREADY:  // UPDATEREADY == 4
				return 'UPDATEREADY';
				break;
			case ac.OBSOLETE: // OBSOLETE == 5
				return 'OBSOLETE';
				break;
			default:
				return 'UKNOWN CACHE STATUS';
				break;
		};
	},

    /**
     * Edit mode toggle. Shall be called only when logged in.
     */
    editModeToggle: function() {
        var $e = $('article');
		var $a = $('a[href="#contribute"]');
        var className = 'editmode';
        if (sendanmaki.editMode) {
            $e.removeClass(className);
            $a.removeClass(className);
            sendanmaki.editMode = 0;
        }
        else {
            $e.addClass(className);
            $a.addClass(className);
            sendanmaki.editMode = 1;
        }
        localStorage.setItem('editMode', sendanmaki.editMode);
    },

    /**
     * Click handler for the elements that can be edited.
     */
    editModeClick: function($e) {
        var html = $e.outerHtml();
        var form = $(sendanmaki.editForm).clone();
        form.data('original', html);
        form.children('textarea').attr('lang', sendanmaki.lang).val(html);
        $.colorbox({
            html: form,
            modal: true,
            onComplete: function() {
                var origClose = $.colorbox.close;
                $.colorbox.close = function() {
                    // but this check now anyhow the initial values...
                    if (form.data('original') != form.children('textarea').val())
                    {
                        var response = confirm('Haluatko varmasti sulkea tämän mahdollisesti muokatun tekstin?');
                        if (!response) {
                            return false;
                        }
                    }
                    origClose();
                };
            }
        });
    },

	/**
	 * Handle a click on a media thumbnail.
	 * It can be a Flickr image, Vimeo or Youtube video.
	 */
	mediaThumbClick: function($a) {
		var data = $a.data();

		// Tell Analytics
		_gaq.push(['_trackPageview', $a.attr('href')]);

		if (data.type && data.type == 'flash') {
			// Vimeo has size data, Youtube does not
			var w = $('#wrapper').width();
			var h = w * 0.75;
			if (data.width) {
				w = data.width;
			}
			if (data.height) {
				h = data.height;
			}
			var player = $.flash.create({
				swf: data.url,
				height: '100%',
				width: '100%'
			});
			$.colorbox({
				html: player,
				title: $a.attr('title'),
				height: h,
				width: w,
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
     * Callback for submitting the contribution form.
	 * It will insert the edited content to article.
     */
    submitEditForm: function($form) {
		var $a = $('article');
        var $c = $a.clone();
		// replace .mediathumb parts by [|]
		$c.children('.mediathumb').replaceWith(function() {
			return "\n" + '[' + $(this).data('key') + ']' + "\n";
		});
		var orig = $c.html(); // string
		// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
		var edited = orig.replace($form.data('original'), $form.children('textarea[name="content"]').val());
        var data = {
            lang: sendanmaki.lang,
            page: location.pathname,
            content: edited,
            modified: sendanmaki.dataModified
        };
		console.dir(data);

		// Update the page
		var article = $a.html();
		$('article').html(article.replace($form.data('original'), $form.children('textarea[name="content"]').val()));

		// disable send button
		$('input[type="submit"]').attr('disabled', 'disabled');

		// Feedback of the ajax submit on background color
        $form.addClass('ajax-ongoing');

        $.post($form.attr('action'), data, function(received, status){
			$form.removeClass('ajax-ongoing');

            var style;
            if (status != 'success') {
                style = 'ajax-failure';
            }
            else if (received.answer) {
                // 1 or true
                style = 'ajax-success';

                // Success, thus return original later
                setTimeout(function() {
                    $form.removeClass(style);
                    //$.colorbox.close();
                }, 2 * 1000);
            }
            else {
                style = 'ajax-unsure';
            }

            $form.addClass(style);
			$('input[type="submit"]').attr('disabled', null);
        }, 'json');
    },

    /**
     * Callback for a click on the #contribute link located in the footer.
     * This should be only called if not logged in.
     */
    openLoginForm: function() {
        $.colorbox({
            title: $('#contribute').attr('title'),
            modal: true,
            html: sendanmaki.loginForm,
            onComplete: function() {
                $('input[type="submit"]').attr('disabled', 'disabled');
                $('input[type="hidden"][name="lang"]').attr('lang', 'fi');
                $('input[type="hidden"][name="page"]').attr('page', location.pathname);
                $('input[name="identifier"]').focus().on('change keyup', function() {
                    var openid = $(this).val();
                    if (openid.search('@') !== -1) { // TODO: fix search regex to valid OpenID
                        $('input[type="submit"]').attr('disabled', null);
                    }
                });
            }
        });
    },

    /**
     * Show a message that was set via temporary session variable
     * div#logo shall contain all the message data
     * @param   msg    Data item to be used
     */
    showAppMessage: function(msg) {
        var text = $('#logo').data(msg);
        if (typeof text !== 'undefined') {
			// Show colorbox
			$.colorbox({
				html: '<h1 class="appmessage ' + msg.toLowerCase() + '">' + text + '</h1>',
				modal: true,
				scrolling: false,
				onComplete: function() {
					// Hide automatically after 4 seconds
					setTimeout(function() {
						$.colorbox.close();
					}, 2 * 1000);
				}
			});
        }
    },

    /**
     * Show a note on a image that has src == data.url
     * data = {x1, x2, y1, y2, width, heigth, note, url}
     */
    showImgNote: function(data) {
        console.log('showNote.');
		console.dir(data);
        var parent = $('img[src="' + data.url + '"]').parent();
        var div = $('<div class="note"></div>');
        var tpo = parent.position();
        div.css('left', data.x1 + tpo.left).css('top', data.y1 + tpo.top);
        var area = $('<span class="notearea"></span>');
        var note = $('<span class="notetext">' + data.note + '</span>');
        area.css('width', data.width).css('height', data.height);
        div.append(area, note);
        parent.append(div).show(400);
    },

    /**
     * A form to be shown in colorbox when editing an article content.
     */
    editForm: '<form action="/update-article" method="post" class="edit">' +
        '<textarea name="content" spellcheck="true"></textarea>' +
        '<input type="submit" value="Lähetä" />' +
        '<input type="button" name="close" value="Sulje" />' +
        '</form>',

    /**
     * Login form. Please note that this uses OpenID.
     */
    loginForm: '<form action="/authenticate-user" method="post" class="login">' +
        '<label>Sähköpostiosoite (OpenID kirjautumista varten)<input type="email" name="identifier" /></label>' +
        '<input type="submit" value="Lähetä" />' +
        '<input type="hidden" name="lang" value="fi" />' +
        '<input type="hidden" name="page" value="/" />' +
        '<input type="button" name="close" value="Sulje" />' +
        '</form>'
};

/**
 * Modernizr test results
 * https://raw.github.com/paazmaya/PaazioTools/master/JavaScript/modernizr.htm
 * Also uses SWFObject.
 */
var mdrnzr = {
    results: {},
	interval: 60 * 60 * 24 * 7 * 2, // 2 weeks
	key: 'last-modernizr',
    url: '/receive-modernizr-statistics',
	once: null, // setInterval id

    /**
     * This shall be run on domReady in order to check against localStorage
     * when was the last time the results were sent, if any.
	 * In case localStorage is not available, not supported or two weeks old,
	 * it will be send again.
     */
    checkUpdate: function() {
		// Running this once is enought
		clearInterval(mdrnzr.once);

		var update = false;
		if (localStorage) {
			var previous = localStorage.getItem(mdrnzr.key);
			if ((previous && ($.now() - previous >  mdrnzr.interval)) || !previous) {
				update = true;
			}
		}
		else {
			update = true;
		}
		if (update) {
			mdrnzr.sendData();
		}
	},

    loopThru: function(obj, prefix) {
        if (!prefix) {
            prefix = '';
        }
        for (var i in obj) {
            if (obj.hasOwnProperty(i) && i.substring(0, 1) != '_' && obj != obj[i]) {
                var type = (typeof obj[i]);
                if (type == 'boolean' || type == 'string') {
                    mdrnzr.results[prefix + i] = obj[i];
                }
                else if (type == 'object') {
                    mdrnzr.loopThru(obj[i], i + '.');
                }
            }
        }
    },

    sendData: function() {
		mdrnzr.loopThru(Modernizr); // fill mdrnzr.results
		var data = {
			modernizr: mdrnzr.results,
			version: Modernizr._version,
			useragent: navigator.userAgent,
			flash: $.flash.version.string
		};

        $.post(mdrnzr.url, data, function(incoming, status) {
            // Thank you, if success
			if (localStorage && status == 'success') {
				localStorage.setItem(mdrnzr.key, $.now());
			}
        }, 'json');
    }
};
