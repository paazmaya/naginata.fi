// editor.js

$(document).ready(function() {
	$.('textarea').wymeditor();
	
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
		alert('Handler for .unload() called.');
		return false;
	});
	
	$('form').submit(function() {
		// no need to do this as ajax since the page is anyhow in modal window
		// but feedback is easier to get in ajax way, of the success update..
		var data = {
			lang: 'fi',
			page: '/',
			article: ''
		};
		
		return false;
	});
});