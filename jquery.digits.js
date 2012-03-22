/*!
 * jquery.digits.js
 * https://github.com/adressler/digits.js
 *
 * Copyright 2012, Armin Dressler
 * Licensed under the MIT license.
 * See LICENSE for details.
 */

// single digit
;!function($) {
	var default_options = {
		  chars : '0123456789'
		, value : ' '
		, duration : 3
		, min : 300
		, max : 1000
		, silentInit : false
		, fallback : ' '
	}

	var methods = {
		init: function(opts) {
			options = $.extend({}, default_options, opts);

			if (typeof options.value == 'undefined' || options.value == '') options.value = options.fallback;

			options.value = options.value.toString().substr(0, 1);

			return this.each(function() {
				var self = $(this)
				  , content = $('<span>', { html: options.value });

				if (self.data('digit.options')) return;

				self.append(content)
					.data({
						  'digit.content': content
						, 'digit.actual': options.value
						, 'digit.options': options
					});
			});
		}

		, set: function(value, opts) {
			if (!value) value = '';
			value = value.toString().substr(0, 1);

			return this.each(function() {
				var self = $(this)
				  , options = $.extend({}, self.data('digit.options'), opts)
				  , charset = (options.fallback + options.chars + options.fallback + options.chars).split('')
				  , actual = self.data('digit.actual')
				  , start = $.inArray(actual, charset)
				  , target = $.inArray(value, charset)
				  , container = $('<div>')
				  , content = ''
				  , offset = '';

				options.chars = options.fallback + options.chars;

				if (start == target) return;
				if (target == -1) target = 0;
				if (start > target) target += options.chars.length;

				self.empty()
					.append(container)
					.data('digit.actual', value)

				for (i = target; i >= start; i--) {
					offset = container.innerHeight();
					content = $('<span>', { html: charset[i] });
					container.append(content);
				}

				// animation time depending on target distance, but between min and max milliseconds
				container.css('margin-top', '-' + offset.toString() + 'px')
					.animate({ 'margin-top': 0 }, Math.min(options.max, Math.max(options.min, offset * options.duration)));
			});
		}
	}

	$.fn.digit = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.digit');
	    }
	};
}(jQuery);

// digits (multiple digit)
;!function($) {
	var default_options = {
		  length : 12
		, chars : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.!'
		, value : 'HELLO WORLD!'
		, align : 'left'
		, duration : 3
		, min : 300
		, max : 1000
		, silentInit : false
		, fallback : ' '
		, digitsWrapper : 'digitsWrapper'
		, digitWrapper : 'digitWrapper'
	}

	var methods = {
		init: function(opts) {
			var options = $.extend({}, default_options, opts)
			  , digit = $('<div>', { class: options.digitWrapper });

			return this.each(function() {
				var self = $(this)
				  , value = opts.value
				  , el = $('<div>');

				if (self.data('digits.options')) return;

				// get predefined value from: options, data-digits-value attribute, DOM content, default
				if (!value && self.attr('data-digits-value')) value = self.attr('data-digits-value');
				if (!value && self.text()) value = self.text();
				if (!value) value = options.value;

				for (i = 1; i <= options.length; i++) {
					el.append(digit.clone());
				}

				self.removeAttr('data-digits-value')
					.addClass(options.digitsWrapper)
					.find('.' + options.digitWrapper)
						.remove()
						.end()
					.data('digits.options', options)
					.append(el.children())
					.children('.' + options.digitWrapper)
						.digit('init', {
							  chars: options.chars
							, duration: options.duration
							, min: options.min
							, max: options.max
							, value: options.fallback
							, fallback: options.fallback
						})
						.end()
					.digits('set', value, options.silentInit ? { min: 0, max: 0 } : {});
			});
		}

		, set: function(value, opts) {
			var length = (value = value.toString()).length;

			return this.each(function() {
				var self = $(this)
				  , options = self.data('digits.options')
				  , diff = options.length - length
				  , digits = self.children('.' + options.digitWrapper);

				// append or prepend spaces
				for (i = 1; i <= diff; i++) {
					value = (options.align == 'right') ? options.fallback + value : value + options.fallback;
				}

				$.each(digits, function(i, digit) {
					$(digit).digit('set', value.substr(i, 1), opts);
				});
			});
		}
	}

	$.fn.digits = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.digits');
	    }
	};
}(jQuery);
