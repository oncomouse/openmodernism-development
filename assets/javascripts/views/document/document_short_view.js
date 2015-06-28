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
		window.DocumentShortView = factory(Backbone, JST);
	}

}(function (Backbone, JST) {
	var DocumentShortView = Backbone.View.extend({
		tagName: 'li',
		template: JST['document/document_shortview'],//_.template($('#documents-document_shortview').html()),
		render: function() {
			this.$el.html(this.template({ model: this.model }));
			return this;
		},
		initialize: function() {
			this.model.on('change', this.render, this);
		}
	});
	return DocumentShortView;
}));