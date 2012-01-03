/* naginata.js */


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-2643697-14']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function() {
	sendanmaki.domReady();
    
    mdrnzr.results['modernizr'] = mdrnzr.loopThru(Modernizr);
    mdrnzr.results['useragent'] = navigator.userAgent;
    //mdrnzr.sendData();
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
     * Ajax call on every page load checks this.
     */
	isLoggedIn: false,
    
    /**
     * Email address of the current user against OAuth.
     */
    userEmail: '',
    
	/**
	 * This shall be run on domReady in order to initiate
	 * all the handlers needed.
	 */
	domReady: function() {
			
		var links = $('article a:not(.mediathumb a)').length;
		console.log('links: ' + links);
		
		$('article a:not(.mediathumb a)').click(function() {
			console.log('something was clicked');
			return false;
		});
		$('.mediathumb a').colorbox();
		
		// Track ColorBox usage with Google Analytics
		$(document).on('cbox_complete', function(){
			var href = $.colorbox.element().attr("href");
			console.log('cbox_complete occurred, href: ' + href);
			if (href) {
				_gaq.push(['_trackPageview', href]);
			}
		});
	
	
		// Open modal for logging in via OAuth and edit pages.
		$('a[href="#contribute"]').click(function() {
			sendanmaki.contributeClick();
			return false;
		});
		
		$('#colorbox form').live('submit', function() {
			sendanmaki.submitForm($(this));
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
	 * TODO: Implementation...
	 */
	submitForm: function($form) {
		console.log('submit');
		// no need to do this as ajax since the page is anyhow in modal window
		// but feedback is easier to get in ajax way, of the success update..
		var data = {
			lang: 'fi',
			page: '/',
			content: $form.children('textarea[name="content"]').text()
		};
		$.post($form.attr('action'), data, function(received, status){
			console.log('' + status);
			console.dir(received);
		}, 'json');
	},
	
	/**
	 * Callback for a click on the #contribute link located in the footer.
	 * TODO: OAuth?
	 */
	contributeClick: function() {
		var form = $(sendanmaki.editForm).children('textarea').text($('article').html()).parent().get(0);
		
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
		$.colorbox({
			html: form,
			title: $(this).attr('title'),
			modal: true
		});
		
		$('textarea').wymeditor({
			lang: 'fi',
			skin: 'compact'
		});
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
		'<input type="submit" value="Send" />' +
		'<input type="button" name="close" value="Close" />' +
		'</form>'
};

/**
 * Modernizr test results
 * https://raw.github.com/paazmaya/PaazioTools/master/JavaScript/modernizr.htm
 */
var mdrnzr = {
    results: {},
    
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
        console.dir(mdrnzr.results);
        $.post('/receive-modernizr-statistics', mdrnzr.results, function(incoming, status) {
            // Thank you, if success
            console.log('incoming: ' + incoming);
            console.log('status: ' + status);
        }, 'json');
    }
};
