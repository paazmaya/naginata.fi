/**
 * jQuery.outerHtml
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 * 
 * Get the inner and outer html data,
 * that is the selected element itself including.
 */
(function ($) {
	$.fn.outerHtml = function () {
		var outer = null;
		if (this.size()) {
			var div = $('<div style="display:none;"></div>');
			var clone = $(this[0].cloneNode(false)).html(this.html()).appendTo(div);
			outer = div.html();
			div.remove();
		}
		return outer;
	};
})(jQuery);
