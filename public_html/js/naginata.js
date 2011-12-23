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
	$('article a').click(function() {
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
		return false;
	});

});
