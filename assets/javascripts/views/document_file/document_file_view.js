'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone', 'jst'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined') {
		window.DocumentFileView = factory(Backbone, JST);
	}

}(function (Backbone, JST) {
	var DocumentFileView = Backbone.View.extend({
		el: '#app',
		template: JST['document_file/display'],
		initialize: function(model) {
			this.model = model;
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(this.template({model: this.model}));
		}
	});
	return DocumentFileView;
}));
	