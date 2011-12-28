/* naginata.js */

var googleAnalytics = 'UA-2643697-14';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', googleAnalytics]);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$(document).ready(function() {
	var links = $('article a:not(.mediathumb a)').size();
	console.log('links: ' + links);
	$('article a:not(.mediathumb a)').click(function() {
		console.log('something was clicked');
		return false;
	});
	$('.mediathumb a').colorbox();
	
	// Track ColorBox usage with Google Analytics
	$(document).bind('cbox_complete', function(){
		var href = $.colorbox.element().attr("href");
		console.log('cbox_complete occurred, href: ' + href);
		if (href) {
			_gaq.push(['_trackPageview', href]);
		}
		
	});
	
	
	// Open modal for logging in via OAuth and edit pages.
	$('a[href="#contribute"]').click(function() {
		var ops = '';
		$('nav a').each(function() {
			var t = $(this);
			ops += '<option value="' + t.attr('href') +
				'">' + t.text() + ' [' + t.attr('href') + ']</option>';
		});
		console.log('appending ops: ' + ops);
		editform = $(editform).children('select').append(ops).parent().children('textarea').text($('article').html()).parent().get(0);
		
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
			html: editform,
			title: $(this).attr('title'),
			modal: true
		});
		
		$('textarea').wymeditor({
			lang: 'fi',
			skin: 'compact'
		});
		return false;
	});
	
	$('form').live('submit', function() {
		console.log('submit');
		// no need to do this as ajax since the page is anyhow in modal window
		// but feedback is easier to get in ajax way, of the success update..
		var data = {
			lang: 'fi',
			page: '/',
			article: ''
		};
		
		return false;
	});
		
	$('select').change(function() {
		console.log('$(this).val(): ' + $(this).val());
		
		var str = "";
		$('select option:selected').each(function () {
			str += $(this).text() + " ";
		});
		$("div").text(str);
	})
	.change();
	
	$(window).unload(function() {
		//alert('Handler for .unload() called.');
		return false;
	});

});

var editform = '<form action="" method="post">' +
	'<select name="">' +
		'<option value=""></option>' +
	'</select>' +
	'<textarea name=""></textarea>' +
	'<input type="submit" value="Send" />' +
	'</form>';
