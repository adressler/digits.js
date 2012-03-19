/*!
 * digits.js
 * https://github.com/adressler/digits.js
 *
 * Copyright 2012, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */

// single digit
;(function($) {
	var default_options = {
		chars : [ ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ],
		value : ' '
	}

	var methods = {
		init: function(options) {
			options = $.extend(default_options, options);
			if (options.value == undefined || options.value == '') options.value = ' ';
			options.value = options.value.toString().substr(0, 1);
			return this.each(function() {
				var self = $(this);
				if (self.data('digit.init')) return;
				self.addClass('digitWrapper');
				var content = $('<span>').html(options.value);
				self.append(content);
				self.data('digit.content', content);
				self.data('digit.actual', options.value);
				self.data('digit.options', options);
				self.data('digit.init', true);
			});
		},
		set: function(value) {
			if (value == undefined || value == '') value = ' ';
			value = value.toString().substr(0, 1);

			return this.each(function() {
				var self = $(this);

				var options = self.data('digit.options');
				var charset = [];
				$.merge(charset, options.chars);
				$.merge(charset, options.chars);

				var actual = self.data('digit.actual');
				var start = $.inArray(actual, charset);
				var target = $.inArray(value, charset);

				if (start == target) return;
				if (target == -1) target = 0;
				if (start > target) target += options.chars.length;

				self.empty();
				var container = $('<div>');
				self.append(container);

				var offset = '';

				for (i=target; i>=start; i--) {
					offset = container.innerHeight();
					var content = $('<span>').html(charset[i]);
					container.append(content);
				}

				container.css('margin-top', '-' + offset.toString() + 'px');

				// animation time depending on target distance, but between 300ms and 1000ms
				container.animate({'margin-top': 0}, Math.min(1000, Math.max(300, offset * 3)));

				self.data('digit.actual', value);
			});
		}
	}

	$.fn.digit = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.digit' );
	    }
	};
})(jQuery);

// digits (multiple digit)
(function($) {
	var methods = {
		init: function(length) {
			if (length == undefined) length = 5;
			var digit = $('<div>');
			return this.each(function() {
				var self = $(this);
				console.log(self);
				if (self.data('digits.init')) return;
				self.addClass('digitsWrapper');
				for (i=1; i<=length; i++) {
					self.append(digit.clone());
				}
				self.children().digit('init');
				self.data('digits.length', length);
				self.data('digits.init', true);
			});
		},
		set: function(value) {
			return this.each(function() {
				var self = $(this);
				value = value.toString();
				var length = value.length;
				var diff = self.data('digits.length') - length;
				for (i=1; i<=diff; i++) {
					value = ' ' + value;
				}
				var digits = self.children('.digitWrapper');
				$.each(digits, function(i, digit) {
					$(digit).digit('set', value.substr(i, 1));
				});
			});
		}
	}

	$.fn.digits = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.digits' );
	    }
	};
})(jQuery);
