/*!
 * jquery.digits.js
 * https://github.com/adressler/digits.js
 *
 * Copyright 2012, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */

// single digit
;(function($) {
	var default_options = {
		chars : ' 1234567890',
		value : ' ',
		min : 300,
		max : 1000
	}

	var methods = {
		init: function(opts) {
			options = $.extend({}, default_options, opts);
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
				var charset = ''.split('');
				$.merge(charset, options.chars.split(''));
				$.merge(charset, options.chars.split(''));

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
				container.animate({'margin-top': 0}, Math.min(options.max, Math.max(options.min, offset * 3)));

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
	var default_options = {
		length: 12,
		chars: ' 1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ.!',
		value: 'HELLO WORLD!',
		align: 'left',
		min: 300,
		max: 1000
	}
	var methods = {
		init: function(opts) {
			var options = $.extend({}, default_options, opts);

			var digit = $('<div>');
			return this.each(function() {
				var self = $(this);

				// get predefined value from: options, data-digits-value attribute, DOM content, default
				var value = opts.value;
				if (!value && self.attr('data-digits-value')) value = self.attr('data-digits-value');
				if (!value && self.text()) value = self.text();
				if (!value) value = options.value;

				if (self.data('digits.options')) return;
				self.addClass('digitsWrapper').empty();
				for (i=1; i<=options.length; i++) {
					self.append(digit.clone());
				}
				self.children().digit('init', {
					chars: options.chars,
					min: options.min,
					max: options.max
				});

				// save options to element
				self.data('digits.options', options);

				self.digits('set', value);
			});
		},
		set: function(value) {
			return this.each(function() {
				value = value.toString();
				var self = $(this);
				var options = self.data('digits.options');

				// append or prepend spaces
				var length = value.length;
				var diff = options.length - length;
				for (i=1; i<=diff; i++) {
					value = (options.align=='right') ? ' ' + value : value + ' ';
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
