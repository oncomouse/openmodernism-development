'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined') {
		window.MetadataObject = factory(Backbone);
	}

}(function (Backbone) {
	var MetadataObject = Backbone.Model.extend({
		defaults: {
			string: '',
			original: ''
		},
		to_s: function() {
			return this.attributes['string'];
		},
		raw: function() {
			return this.attributes['original'];
		},
		initialize: function() {
		}
	});
	return MetadataObject;
}));