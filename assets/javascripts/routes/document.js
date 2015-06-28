define([
	'models/document',
	'views/document/document_view'
], function(
	Document,
	DocumentView
) {
	DocumentRoute = function(app, id) {
		var currentDocument = {};
	
		app.clearAppCanvas();
	
		// Detect if it is possible to extract the document from a preexisting documentList instance:
		if (typeof app.documentList !== 'undefined') {
			currentDocument = app.documentList.get(parseInt(id));
			app.currentDocumentView = new DocumentView(currentDocument);
			app.currentDocumentView.render();
			app.router.trigger('ready');
		} else {
			currentDocument = new Document({'id': id});
			currentDocument.fetch().then(function() {
				app.currentDocumentView = new DocumentView(currentDocument);
				app.currentDocumentView.render();
				app.router.trigger('ready');
			});
		}
	}
	
	return DocumentRoute;
});