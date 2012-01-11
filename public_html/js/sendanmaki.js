/***************
 * NAGINATA.fi *
 *************** 
 * sendanmaki.js
 */

// Google Analytics for naginata.fi
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2643697-14']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
// Enought about Google Analytics

$(document).ready(function() {
    sendanmaki.domReady();
	mdrnzr.domReady();
    /*
     * imgareaselect
     *
     * CSS3 stuff
     * image-orientation: 0deg
     *
     * transform: translate(80px, 80px) scale(1.5, 1.5) rotate(45deg);
     *
     * h1
{
rotation-point:50% 50%;
rotation:180deg;
}
     */
});


var sendanmaki = {
    /**
     * Is the user logged in to the backend?
     * The initial value is in body data.
     */
    isLoggedIn: 0,

    /**
     * Email address of the current user against OpenID.
     */
    userEmail: '',

    /**
     * Colors to be used as a feedback of an ongoing AJAX call.
     */
    colors: {
        green : '#39B54A',
        blue : '#75B2F1',
        red : '#F13A1C',
        yellow : '#FAE534'
    },

    /**
     * This shall be run on domReady in order to initiate
     * all the handlers needed.
     */
    domReady: function() {
        var fData = $('footer').data();
        sendanmaki.isLoggedIn = fData.isLoggedIn;
        sendanmaki.userEmail = fData.userEmail;
        
		/*
        $('article a:not(.mediathumb a, .imagelist a)').click(function() {
            console.log('something was clicked');
            return false;
        });
		*/
	
		// href has link to actual page, rel has inline link
        $('.mediathumb a:has(img)').click(function() {
			var $a = $(this);
			var rel = $a.attr('rel');
			var href = $a.attr('href');
			var type = $a.attr('type');
			
			// Tell to Analytics
            _gaq.push(['_trackPageview', href]);
			
			if (type && type == 'application/x-shockwave-flash')
			{
				// Vimeo has size data, Youtube does not
				var w = $('#wrapper').width();
				//$a.data('width');
				var player = $.flash.create({
					swf: rel,
					height: '100%',
					width: '100%'
				});
				$.colorbox({
					html: player,
					title: $a.attr('title'),
					height: w * 0.75,
					width: w,
					scrolling: false
				});
			}
			else
			{
				$.colorbox({
					href: rel,
					photo: true
				});
			}
			return false;
		});
		$('.imagelist a').colorbox({
			rel: 'several'
		});
		/*
		$('.imagelist a').click(function() {
			$.colorbox({
				href: $(this).attr('rel'),
				rel: 'flickr'
			});
			return false;
		});
		*/
	
		$('.youtube > a').colorbox();
		/*click(function() {
			return false;
		});*/

        // Track ColorBox usage with Google Analytics
        $(document).on('cbox_complete', function(){
            var href = $.colorbox.element().attr("href");
            if (href) {
                _gaq.push(['_trackPageview', href]);
            }
        });

        // Open modal for logging in via OAuth and edit pages.
        $('a[href="#contribute"]').click(function() {
            sendanmaki.contributeClick();
            return false;
        });

        // Logged in can most likely edit content, thus AJAX.
        $('#colorbox form').live('submit', function() {
            if (sendanmaki.isLoggedIn) {
                sendanmaki.submitEditForm($(this));
            }
            else {
                sendanmaki.submitLoginForm($(this));
            }
            return false;
        });

        $('#colorbox input[type="button"][name="close"]').live('click', function() {
            $.colorbox.close();
        });

        $(window).on('unload', function() {
            console.log('unload');
            //return false;
        });
        $(window).on('beforeunload', function() {
            console.log('beforeunload');
            //return false;
        });

        // So sad, but in 2012 there still needs to be a keep alive call
        setInterval(function() {
            $.post('/keep-session-alive', {keepalive: 'hoplaa'}, function(received, status) {
                console.log(received.answer); // seconds
            }, 'json');
        }, 1000 * 60 * 3); // 2 minutes
    },

    /**
     * Check if the user is logged in based on the local storage information
     */
    checkLogin: function() {
        var lastLogin = localStorage.getItem('lastLogin');
        if (lastLogin) {
        }
        var userEmail = localStorage.getItem('userEmail');
    },

    /**
     * Callback for submitting the contribution form.
     */
    submitEditForm: function($form) {
        var data = {
            lang: 'fi',
            page: location.pathname,
            content: $form.children('textarea[name="content"]').text()
        };

        var orig = $form.css('background-color');
        $form.css('background-color', sendanmaki.colors.blue);

        $.post($form.attr('action'), data, function(received, status){
            console.log('status' + status);
            console.dir(received);
            if (status != 'success') {
                $form.css('background-color', sendanmaki.colors.red);
            }
            else if (received.answer) {
                // 1 or true
                $form.css('background-color', sendanmaki.colors.green);
                setTimeout(function() {
                    $form.css('background-color', orig);
                    $.colorbox.close();
                }, 2 * 1000);
            }
            else {
                $form.css('background-color', sendanmaki.colors.yellow);
            }
        }, 'json');
    },

    /**
     *
     */
    submitLoginForm: function($form) {
        var data = {
            lang: 'fi',
            page: location.pathname,
            identifier: $('input[name="identifier"]').val()
        };
        console.log('about to submit login form');
        console.dir(data);

        // This will be redirected to the OpenID provider site
        $.post($form.attr('action'), data, function(received, status) {
            console.log('status' + status);
            console.dir(received);
            if (status == 'success' && received.answer) {
                location.href = received.answer;
            }
        }, 'json');
    },

    /**
     * Callback for a click on the #contribute link located in the footer.
     */
    contributeClick: function() {
        var opts = {
            title: $(this).attr('title'),
            modal: true
        };
        var form = sendanmaki.loginForm;
        if (sendanmaki.isLoggedIn) {
            form = $(sendanmaki.editForm).children('textarea').text($('article').html()).parent().get(0);
        }
        else {
            //
        }
        opts.html = form;
        console.dir(opts);
        /*
        var originalClose = $.colorbox.close;
        $.colorbox.close = function(){
            var response;
            if ($('#cboxLoadedContent').find('form').length > 0) {
                response = confirm('Do you want to close this window?');
                if (!response) {
                    return; // Do nothing.
                }
            }
            originalClose();
        };
        */

        // How about call back for content update?
        $.colorbox(opts);
        if (sendanmaki.isLoggedIn) {
            $('textarea').wymeditor({
                lang: 'fi',
                skin: 'compact',
                updateSelector: 'input[type="submit"]',
                updateEvent: 'mousedown',
                postInit: function(wym) {
                    $('iframe').on('blur', function() {
                        console.log('iframe blur event occurred');
                        wym.update();
                    });
                }
            });
        }
        else {
            $('input[name="identifier"]').focus();
        }
    },

    /**
     * data = {x1, x2, y1, y2, width, heigth, note, url}
     */
    showNote: function(data) {
        console.log('showNote.');
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
    editForm: '<form action="/update-article" method="post">' +
        '<textarea name="content"></textarea>' +
        '<input type="submit" value="Lähetä" />' +
        '<input type="button" name="close" value="Sulje" />' +
        '</form>',

    /**
     * Login form. Please note that this uses OpenID.
     */
    loginForm: '<form action="/authenticate-user" method="post">' +
        '<label>Email (OpenID identification)<input type="email" name="identifier" /></label>' +
        '<input type="submit" value="Lähetä" />' +
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
	
    /**
     * This shall be run on domReady in order to check against localStorage
     * when was the last time the results were sent, if any.
	 * In case localStorage is not available, not supported or two weeks old,
	 * it will be send again.
     */
    domReady: function() {
		var update = false;
		if (localStorage) {
			var previous = localStorage.getItem(mdrnzr.key);
			console.log('previous: ' + previous + ', mdrnzr.interval: ' + mdrnzr.interval);
			if ((previous && previous < $.now() + mdrnzr.interval) || !previous) {
				update = true;
			}
		}
		else {
			update = true;
		}
		
		if (update) {
			mdrnzr.results['modernizr'] = mdrnzr.loopThru(Modernizr);
			mdrnzr.results['useragent'] = navigator.userAgent;
			mdrnzr.results['flash'] = $.flash.version.string;
			mdrnzr.sendData();
		}
	},

    loopThru: function(obj, prefix) {
        if (!prefix) {
            prefix = '';
        }
        var group = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var type = (typeof obj[i]);
                if (type == "boolean" || type == "string") {
                    group[i] = obj[i];
                }
                else if (type == "object") {
                    group[i] = mdrnzr.loopThru(obj[i], i + '.');
                }
            }
        }
        return group;
    },

    sendData: function() {
        $.post('/receive-modernizr-statistics', mdrnzr.results, function(incoming, status) {
            // Thank you, if success
			if (localStorage && status == 'success') {
				localStorage.setItem(mdrnzr.key, $.now());
			}
            console.log('mdrnzr. status: ' + status);
            console.dir(incoming);
        }, 'json');
    }
};
