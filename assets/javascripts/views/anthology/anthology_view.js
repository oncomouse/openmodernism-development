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
		window.DocumentView = factory(Backbone, JST);
	}

}(function (Backbone, JST) {
	var DocumentView = Backbone.View.extend({
		el: '#app',
		template: JST['document/document'],//_.template($('#documents-document').html()),
		initialize: function(model) {
			this.model = model;
			this.model.on('change', this.render, this);
		},
		render: function() {
			this.$el.html(this.template({model: this.model}));
		}
	});
	return DocumentView;
}));