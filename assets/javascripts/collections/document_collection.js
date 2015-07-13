'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'), require('models/document'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone', 'models/document'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined' && typeof Document !== 'undefined') {
		window.DocumentCollection = factory(Backbone, Document);
	}

}(function (Backbone, Document) {
	var DocumentCollection = Backbone.Collection.extend({
		url: '/document',
		model: Document,
		initialize: function() {
			this.listenTo(this, 'update', function() { this.trigger('reset') });
		}
	});
	return DocumentCollection;
}));