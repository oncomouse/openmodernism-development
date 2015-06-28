(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'), require('views/document/document_short_view'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone', 'views/document/document_short_view', 'jst'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined' && typeof DocumentShortView !== 'undefined') {
		window.DocumentsView = factory(Backbone, DocumentShortView, JST);
	}

}(function (Backbone, DocumentShortView, JST) {
	var DocumentsView = Backbone.View.extend({
		el: '#app',
		template: JST['document/documents'],
		render(documentList) {
			this.$el.html(this.template());
			this.$('#DocumentsView').html('');
			documentList.each(function(element) {
				var view = new DocumentShortView({model: element});
				$('#DocumentsView').append(view.render().el);
			});
		}
	});
	
	return DocumentsView;
}));