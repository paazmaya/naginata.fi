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
_gaq.push(['_setDomainName', 'naginata.fi']);
_gaq.push(['_trackPageview']);

// http://code.google.com/apis/analytics/docs/gaJS/gaJSApiBasicConfiguration.html

(function() {
	if (location.port != 7775) { // that is my development server...
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	}
})();
// -- Enought about Google Analytics --


// Run all client side preparation once DOM is ready.
$(document).ready(function() {
    sendanmaki.domReady();

	// Do not run the Modernizr stats immediately.
	if (typeof Modernizr !== 'undefined') {
		mdrnzr.once = setInterval(function() {
			mdrnzr.checkUpdate();
		}, 1200);
	}
});


var sendanmaki = {
    /**
     * Is the user logged in to the backend?
     * Value updated on every keep alive call.
     */
    isLoggedIn: 0,

    /**
     * Email address of the current user against OpenID.
     * Value updated on every keep alive call.
     */
    userEmail: '',

	/**
	 * Current page language.
	 * Fetched from html lang attribute.
	 */
	lang: 'fi',

	/**
	 * Keep alive interval.
	 * 1000 * 60 * 3 ms = 3 minutes
	 */
	keepAliveInt: (60000 * 3),

    /**
     * This shall be run on domReady in order to initiate
     * all the handlers needed.
     */
    domReady: function() {
		// When was the current page content last modified
        //var modified = $('article').data('dataModified');

		sendanmaki.lang = $('html').attr('lang');
		
		// Add notes to a chudan kamae bogu image, if available
		$('.hasnotes li').each(function() {
			var data = $(this).data();
			if (typeof data !== 'undefined') {
				sendanmaki.createImgNote(data);
			}
		}).on('mouseover mouseout', function(event) {
			var data = $(this).data();
			
			if (data.url && data.note) {
				var div =  $('img[src="' + data.url + '"]').parent().children('div.note:contains("' + data.note + '")');
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
					console.log('applicationCache.status when updateready event occurred: ' + applicationCache.status);
				}
			}, false);
		}
		
		// external urls shall open in a new window
        $('a[href^="http://"],a[href^="https://"]').not('.mediathumb a, .imagelist a').click(function() {
            var href = $(this).attr('href');
            window.open(href, $.now());
            return false;
        });

		// href has link to actual page, rel has inline link
        $('.mediathumb a:has(img)').click(function() {
			sendanmaki.mediaThumbClick($(this));
			return false;
		});
		
		// data-photo-page ...
		$('.imagelist a').colorbox({
			rel: 'several'
		});

        // Track ColorBox usage with Google Analytics
        $(document).on('cbox_complete', function() {
            var href = $.colorbox.element().attr('href');
            console.log('cbox_complete occurred. href: ' + href);
            if (href) {
                _gaq.push(['_trackPageview', href]);
            }
        });

        // Open modal form for logging in via OpenID
        $('a[href="#contribute"]').click(function() {
            if (sendanmaki.isLoggedIn) {
                // Edit the current page
                sendanmaki.editModeClick();
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
			
			//console.log('beforeunload');
			//return false;
			
		});

		// Finally check if div#logo data is set. It is used only for messaging
		var success = $('#logo').data('msgLoginSuccess'); // 1 or 0
		if (typeof success !== 'undefined') {
			sendanmaki.showAppMessage(success ? 'loginSuccess' : 'loginFailure');
		}

        // Keep session alive and update login status
        setInterval(function() {
			sendanmaki.keepAlive();
        }, sendanmaki.keepAliveInt);
		sendanmaki.keepAlive();
    },
	
	/**
	 * Keep PHP session alive and get the current login status
	 */
	keepAlive: function() {
		var data = {};
		$.post('/keep-session-alive', data, function(received, status) {
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
	 */
	mediaThumbClick: function($a) {
		var minFlashVer = 9;
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
			
			var player;
			if ($.flash.version.major >= minFlashVer) {
				// 9 should be upgradable in most of the PC cases
				player = $.flash.create({
					swf: data.url,
					height: '100%',
					width: '100%',
					hasVersion: minFlashVer
				});
			}
			else {
				w = '300px';
				h = '140px';
				player = '<p><strong>Vaikuttaa siltä että Flash lisäke ei ole käytettävissä.</strong> Siksi ei tätä sisältöäkään voida tarkistella.</p>' +
					'<p>Viimeisimmän version Flash lisäkkeestä voi ladata osoitteesta ' +
					'<a href="http://get.adobe.com/flashplayer/" title="Get Flash Player">http://get.adobe.com/flashplayer/</a></p>' +
					'<p>Nykyinen versiosi on ' + $.flash.version.string + '</p>';
			}
			
			$.colorbox({
				html: player,
				title: $a.attr('title'),
				height: h,
				width: w,
				scrolling: false,
				iframe: true // for fullscreen to be possible
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
     * Callback for a click on the #contribute link located in the footer.
     * This should be only called if not logged in.
     */
    openLoginForm: function() {
        $.colorbox({
            title: $('#contribute').attr('title'),
            modal: false,
            html: sendanmaki.loginForm			
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
					}, 4 * 1000);
				}
			});
        }
    },

    /**
     * Click handler for the elements that can be edited.
	 * $e is the element, wrapped in jQuery, that was clicked.
     */
    editModeClick: function() {
		// http://api.jquery.com/next/
        var html = $('article').html();
		var $h = $('<div id="contain">' + html + '</div>');
		
		// replace .mediathumb parts by [|]
		$h.children('.mediathumb').replaceWith(function() {
			return "\n" + '[' + $(this).data('key') + ']' + "\n";
		});
		$h.children('.medialocal').replaceWith(function() {
			return "\n" + '[' + $(this).data('key') + ']' + "\n";
		});
		$h.children('ul.imagelist').replaceWith(function() {
			return "\n" + '[' + $(this).data('key') + ']' + "\n";
		});
		
		html = $h.html();
		
        var $form = $(sendanmaki.editForm).clone();
        $form.data('original', html); // what is currently on the page
        $.colorbox({
            html: $form,
            modal: true,
            onComplete: function() {
				$('textarea[name="content"]').attr('lang', sendanmaki.lang).val(html);
				
				var editor = CodeMirror.fromTextArea($('textarea[name="content"]').get(0), {
					mode: 'text/html',
					matchBrackets: true,
					indentUnit: 1,
					tabSize: 2,
					autoClearEmptyLines: true,
					lineWrapping: true,
					lineNumbers: true,
					theme: 'default',
					autofocus: true,
					
					extraKeys: {
						"'>'": function(cm) { cm.closeTag(cm, '>'); },
						"'/'": function(cm) { cm.closeTag(cm, '/'); }
					},
					onChange : function (editor) {
						editor.save();
						var now = new Date();
						$('label span').text('Viimeisin muokkaus ' + now.toLocaleTimeString());
					}
				});
            }
        });
    },
	
	

    /**
     * Callback for submitting the contribution form.
	 * It will insert the edited content to article.
     */
    submitEditForm: function($form) {
		var content = $('textarea[name="content"]').val();
		
		// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date
		var now = new Date();
			
        var data = {
            lang: sendanmaki.lang,
            page: location.pathname,
            content: content
        };
		console.dir(data);

		// Update the page
		$('article').html(content);

		// disable send button
		$('input[type="submit"]').attr('disabled', 'disabled');
		
		// feedback for the user
		$('label span').text('Muokkauksesi lähti koti palvelinta ' + now.toLocaleTimeString());

		// Feedback of the ajax submit on background color
        $form.addClass('ajax-ongoing');

        $.post($form.attr('action'), data, function(received, status){
			$form.removeClass('ajax-ongoing');

			now = new Date();
			$('label span').text('Muokkauksesi lähetetty ' + now.toLocaleTimeString());
			
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
     * Create a note element on a image that has src == data.url
     * data = {x, y, width, heigth, note, url}
     */
    createImgNote: function(data) {
        var parent = $('img[src="' + data.url + '"]').parent();
		var existing = $('div.note[rel="' + data.note + '"]').size();
		if (parent.size() > 0 && existing == 0) {
			var div = $('<div class="note" rel="' + data.note + '"></div>');
			var tpo = parent.position();
			div.css('left', data.x + tpo.left).css('top', data.y + tpo.top);
			var area = $('<span class="notearea"></span>');
			var note = $('<span class="notetext">' + data.note + '</span>');
			area.css('width', data.width).css('height', data.height);
			div.append(area, note);
			parent.append(div).show();
		}
    },

    /**
     * A form to be shown in colorbox when editing an article content.
     */
    editForm: '<form action="/update-article" method="post" class="edit">' +
		'<label>HTML5 sallittu<span>Muokkausta ei vielä lähetetty...</span></label>' +
        '<textarea name="content" spellcheck="true" autofocus="autofocus"></textarea>' +
        '<input type="submit" value="Lähetä" />' +
        '<input type="button" name="close" value="Sulje" />' +
        '</form>',

    /**
     * Login form. Please note that this uses OpenID.
	 * http://www.whatwg.org/specs/web-apps/current-work/multipage/forms.html
     */
    loginForm: '<ul class="login-list"><li><a href="/authenticate-user?identifier=google" title="Google">' +
		'<img src="/img/google_100.png" alt="Google" /><br />Google</a></li></ul>'
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
