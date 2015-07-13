'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'), require('models/anthology'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone', 'models/anthology'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined' && typeof Anthology !== 'undefined') {
		window.AnthologyCollection = factory(Backbone, Anthology);
	}

}(function (Backbone, Anthology) {
	var AnthologyCollection = Backbone.Collection.extend({
		url: '/anthology',
		model: Anthology,
		initialize: function() {
			this.listenTo(this, 'update', function() { this.trigger('reset') });
		}
	});
	return AnthologyCollection;
}));