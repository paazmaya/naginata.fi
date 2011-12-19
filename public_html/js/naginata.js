/* naginata.js */

$(document).ready(function() {
	$('article a').click(function() {
		console.log('something was clicked');
		return false;
	});
	$('.mediathumb a').colorbox();
});

