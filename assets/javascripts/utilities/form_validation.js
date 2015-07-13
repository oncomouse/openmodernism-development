'use strict';

// Polyfill: for Array.reduce() and Function.bind()
if (!Array.prototype.reduce) {
	Array.prototype.reduce = function(callback /*, initialValue*/) {
		'use strict';
		if (this == null) {
			throw new TypeError('Array.prototype.reduce called on null or undefined');
		}
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}
		var t = Object(this), len = t.length >>> 0, k = 0, value;
		if (arguments.length == 2) {
			value = arguments[1];
		} else {
			while (k < len && !(k in t)) {
				k++; 
			}
			if (k >= len) {
				throw new TypeError('Reduce of empty array with no initial value');
			}
			value = t[k++];
		}
		for (; k < len; k++) {
			if (k in t) {
				value = callback(value, t[k], k, t);
			}
		}
		return value;
	};
}
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs	 = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP		= function() {},
				fBound	= function() {
					return fToBind.apply(this instanceof fNOP
								 ? this
								 : oThis,
								 aArgs.concat(Array.prototype.slice.call(arguments)));
				};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

(function (factory) {
	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('jquery'), require('bootstrap/tooltip'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['jquery', 'bootstrap/tooltip'], factory);
	}
	// Browser
	else if (typeof jQuery !== 'undefined' && typeof $.fn.tooltip !== 'undefined') {
		window.FormValidation = factory(jQuery);
	} else {
		console.log('Could not load required dependencies for Form Validation (jquery & bootstrap/tooltip)');
	}
}(function($){
	var FormValidation = {
		tests: [],
		use_tooltips: false,
		setup: function(form) {
			var handle_novalidate = false;
			if(typeof form === 'undefined') {
				form = $('form');
				handle_novalidate = true;
			} else if(!(form instanceof $)) {
				form = $(form);
			}
			$(form).off('submit.formvalidation').on('submit.formvalidation', this.validate.bind(this));
			$(form).find('*[type=submit]').off('click.formvalidation').on('click.formvalidation', this.validate.bind(this));
			$(form).find('input,select,textarea').on('invalid.formvalidation',function(ev){ev.stopPropagation(); return false;})
			
			$('*[formnovalidate]').off('click.formvalidation');
			
			if(handle_novalidate) {
				$('form[novalidate]').off('submit.formvalidation').find('*[type=submit]').off('click.formvalidation');
			}
		},
		setup_input: function(input) {
			if(!(input instanceof $)) {
				input = $(input);
			}
			return input;
		},
		attach_error: function(input, msg) {
			input = this.setup_input(input);
			input.parent().addClass('has-error has-feedback');
			input.after($('<span class="fa fa-times form-control-feedback"></span>"'));
			if(input.closest('form').attr('data-validation-method') == 'tooltip' || this.use_tooltips == true) {
				input.tooltip({title: msg, placement: 'bottom'});
			} else {
				if(typeof input.attr('data-error-msg') !== 'undefined') {
					msg = input.attr('data-error-msg');
				} else if(typeof msg === 'function') {
					msg = msg(input);
				}
				input.after($('<div class="error-msg">' + msg + '</div>'));
			}
		},
		remove_error: function(input) {
			input = this.setup_input(input);
			input.parent().removeClass('has-error has-feedback');
			input.parent().find('.form-control-feedback').remove();
			if(input.closest('form').attr('data-validation-method') == 'tooltip') {
				input.tooltip('destroy');
			} else { 
				input.parent().find('.error-msg').remove();
			}
		},
		has_error: function(input) {
			input = this.setup_input(input);
			return input.parent().hasClass('has-error');
		},
		clear_errors: function(el) {
			var forms;
			el = this.setup_input(el);
			if(el.is('form')) {
				forms = el;
			} else if(el.is('input') || el.is('select') || el.is('textarea')) {
				forms = el.closest('form');
			} else {
				forms = el.find('form');
			}
			this.remove_error(forms.find('input, textarea, select'));
		},
		validate: function(ev) {
			var form, valid = true;
			
			if(ev.target.nodeName !== 'FORM') {
				ev.target = ev.target.form;
			}
			
			form = $(ev.target);

			form.find('input, textarea, select').each(function(i,input) {
				var input_valid = true, error_msg ='';
				input = $(input);
				if(input.attr('type') === 'button') { return; }
				input_valid = this.tests.reduce(function(result, test) {
					if(typeof result !== 'boolean') {
						result = true;
					}
					if(result && test.match(input)) {
						if(!test.test(input)) {
							result = false;
							error_msg = test.msg;
						}
					}
					
					if(result && this.has_error(input)) {
						this.remove_error(input);
					}
					
					return result;
				}.bind(this), true);
				if(input_valid === false) {
					valid = false;
					if(!this.has_error(input)){
						this.attach_error(input, error_msg);
					}
				} else {
					if(this.has_error(input)) {
						this.remove_error(input);
					}
				}
			}.bind(this));

			if(valid || valid && form.attr('data-nosubmit') == 'data-nosubmit') {
				form.trigger('success.validation');
			}
			if(!valid || form.attr('data-nosubmit') == 'data-nosubmit') {
				ev.preventDefault();
				ev.stopPropagation();
				valid = false;
			}
			return valid;
		},
		// addTest({match: function(input){}, test: function(input) {}, msg: ''})
		//	 OR
		// addTest(function(input) {}, function(input) {}, '') // match, test, msg
		addTest: function() {
			var test_object = undefined;
			if(arguments.length == 1 && typeof arguments[0] === 'object') {
				test_object = arguments[0];
			} else if(arguments.length >= 3 && typeof arguments[0] === 'function' && typeof arguments[1] === 'function' && typeof arguments[2] === 'string') {
				test_object = {
					match: arguments[0],
					test: arguments[1],
					msg: arguments[2]
				}
				if(arguments.length > 4) {
					test_object.name = arguments[3];
				}
			}
			
			// Discard bad inputs:
			if(typeof test_object === 'undefined' || !('match' in test_object) || !('test' in test_object)) {
				console.log('Invalid test added to addTest()', arguments);
				return this;
			}
			
			this.tests.push(test_object);
			return this;
		},
		removeTest: function(name) {
			var index = _.findIndex(this.tests, _.bind(function(x) { return x.name == this; }), name);
			
			if(index >= 0 && index < this.test.length) {
				tests.splice(index, 1);
			}
			
			return this;
		}
	};
	
	FormValidation.addTest({
		name: 'required',
		match: function(input) { return input.attr('required') == 'required'; },
		test: function(input) { return input.val() != ''; },
		msg: 'This element is required.'
	});
	FormValidation.addTest({
		name: 'email',
		match: function(input) { return input.attr('type') == 'email'; },
		test: function(input) { return input.val().match(/^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/); },
		msg: 'Please enter a valid email address.'
	});
	FormValidation.addTest({
		name: 'url',
		match: function(input) { return input.attr('type') == 'url'; },
		test: function(input) { return input.val().match(/[a-z][\-\.+a-z]*:\/\//i); },
		msg: 'Please enter a valid url.'
	});
	FormValidation.addTest({
		name: 'color',
		match: function(input) { return input.attr('type') == 'color'; },
		test: function(input) { return input.val().match(/(\#[0-9A-Fa-f]{6}|\#[0-9A-Fa-f]{3})/); },
		msg: 'Please enter a valid color (#000 OR #000000).'
	});
	FormValidation.addTest({
		name: 'max',
		match: function(input) { return input.attr('max') !== undefined; },
		test: function(input) { return parseInt(input.val()) <= parseInt(input.attr('max')); },
		msg: 'Please enter a value less than the max.'
	});
	FormValidation.addTest({
		name: 'min',
		match: function(input) { return input.attr('min') !== undefined; },
		test: function(input) { return parseInt(input.val()) >= parseInt(input.attr('min')); },
		msg: 'Please enter a value greater than the min.'
	});
	FormValidation.addTest({
		name: 'maxLength',
		match: function(input) { return input.attr('maxLength') !== undefined; },
		test: function(input) { return input.get(0).validity.valid; },
		msg: 'Entered string is too long.'
	});
	FormValidation.addTest({
		name: 'minLength',
		match: function(input) { return input.attr('minLength') !== undefined; },
		test: function(input) { return input.get(0).validity.valid; },
		msg: 'Entered string is too shot.'
	});
	FormValidation.addTest({
		name: 'pattern',
		match: function(input) { return input.attr('pattern') !== undefined; },
		test: function(input) { return input.match(new RegExp(input.val())); },
		msg: 'Enter a value matching the required pattern.'
	});
	FormValidation.addTest({
		name: 'match',
		match: function(input) { return input.attr('data-match') !== undefined; },
		test: function(input) { var input2 = $(input.attr('data-match')); return input.val() == input2.val(); },
		msg: 'Entered value does not match.'
	});
	FormValidation.addTest({
		name: 'number',
		match: function(input) { return input.attr('type') == 'number'; },
		test: function(input) { if (input.attr('min') !== undefined || input.attr('max') !== undefined) { return true; } return /^[0-9](\.[0-9]+)+$/.test(input.val());},
		msg: 'Please enter a valid number'
	});
	FormValidation.addTest({
		name: 'date',
		match: function(input) { return input.attr('type') == 'date'; },
		test: function(input) { if (input.attr('pattern') !== undefined) { return true; } return input.val().match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/);},
		msg: 'Please enter a valid date (YYYY-MM-DD)'
	});
	/*
	 * This telephone validator is a mess (b/c telephone validation is a mess of international standards.).
	 * Google provides a library to do phone validation, but it's huge (around 200K compiled). The native
	 * version I've provided supports a few country codes (US & UK are pretty good), but come in at a lot smaller.
	 *
	 * You can include the google library by adding <script src="google/phonenumberutil.min.js"></script> before this
	 * library or take a look at the provided amd-main.js file to see how to include it in your Require.js project.
	 *
	 * If you need to check telephone numbers, I would suggest writing a custom test to your country or accept the 
	 * hit from the Google library.
	 */
	FormValidation.addTest({
		name: 'tel',
		match: function(input) { return input.attr('type') == 'tel'; },
		test: function(input) { 
			if (input.attr('pattern') !== undefined) { return true; }
			var country = 'US', regex;
			if (input.attr('country') !== undefined) {
				country = input.attr('country');
			}
			// If the Google library (which is awesome) is loaded, use it:
			if(typeof PhoneNumberUtil === 'function') {
				return PhoneNumberUtil(input.val(), country);
			}
			
			// Otherwise, use our builtin in validator which is solid on US & UK numbers and OK on the few others implemented below:
			switch(country) {
				case 'US':
					regex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
					break;
				case 'AE':
					regex = /^[Z]$/;
					break;
				case 'BG':
					regex = /^[Z]$/;
					break;
				case 'BR':
					regex = /^[Z]$/;
					break;
				case 'CN':
					regex = /^[Z]$/;
					break;
				case 'CZ':
					regex = /^[Z]$/;
					break;
				case 'DK':
					regex = /^((\(?\+45\)?)?)(\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/;
					break;
				case 'FR':
					regex = /^0[1-6]{1}(([0-9]{2}){4})|((\s[0-9]{2}){4})|((-[0-9]{2}){4})$/;
					break;
				case 'DE':
					regex = /^[Z]$/;
					break;
				case 'IN':
					regex = /^0{0,1}[1-9]{1}[0-9]{2}[\s]{0,1}[\-]{0,1}[\s]{0,1}[1-9]{1}[0-9]{6}$/;
					break;
				case 'MA':
					regex = /^[Z]$/;
					break;
				case 'NL':
					regex = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/;
					break;
				case 'PK':
					regex = /^[Z]$/;
					break;
				case 'RO':
					regex = /^[Z]$/;
					break;
				case 'RU':
					regex = /((8|\+7)-?)?\(?\d{3}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}/;
					break;
				case 'SK':
					regex = /^[Z]$/;
					break;
				case 'ES':
					regex = /^[0-9]{2,3}-? ?[0-9]{6,7}$/;
					break;
				case 'TH':
					regex = /^[Z]$/;
					break;
				case 'GB':
					regex = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
					break;
				case 'AU':
					regex = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
					break;
				case 'VE':
					regex = /^[Z]$/;
					break;
			}
			return regex.test(input.val());
		},
		msg: 'Please enter a valid telephone number.'
	})
	
	return FormValidation;
}));