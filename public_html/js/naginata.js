/* naginata.js */
var titleSuffix = 'NAGINATA.fi';
var currentSection = '#finland';

$(document).ready(function() {
	var hash = window.location.hash;
	console.log('Initial hash: ' + hash);
	if (hash != '') {
		// Check against available sections.
		if ($('section' + hash).length == 1) {
			var title = $('nav a[href=' + hash + ']').attr('title');
			displaySection(hash, title, 0);
		}
	}
	$('nav a').click(function() {
		var href = $(this).attr('href');
		var title = $(this).attr('title');
		console.log('navigation click. href: ' + href);
		displaySection(href, title);
		return false;
	});
});

function displaySection(hash, title, speed) {
	if (typeof speed === 'undefined') {
		speed = 200;
	}
	$('section:visible').slideUp(speed);
	$(hash).slideDown(speed);
	document.title = title + ' - ' + titleSuffix;
	window.location.hash = hash;
}