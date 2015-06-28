define([
	'jquery',
	'collections/document_collection',
	'views/document/documents_view'
], function(
	$,
	DocumentCollection,
	DocumentsView
) {
	var DocumentsRoute = function(app) {
		var new_document_list = false;
	
		app.clearAppCanvas();
	
		if(!('documentList' in app)) {
			new_document_list = true;
			app.documentList = new DocumentCollection();
		}
		if(!('documentsView' in app)) {
			app.documentsView = new DocumentsView();
		}
		if(new_document_list) {
			app.documentList.fetch().then(function() { 
				$.when(app.documentsView.render(app.documentList)).done(function() {
					app.router.trigger('ready');
				});
			});
		} else {
			$.when(app.documentsView.render(app.documentList)).done(function() {
				app.router.trigger('ready');
			});
		}
	}
	return DocumentsRoute;
});