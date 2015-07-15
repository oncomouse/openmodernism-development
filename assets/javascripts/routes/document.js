'use strict';

define([
	'models/document',
	'views/document/document_view',
	'dispatcher'
], function(
	Document,
	DocumentView,
	AppDispatcher
) {
	var DocumentRoute = function(app, id) {
		var currentDocument = {};
	
		app.clearAppCanvas();
		
		//this.dispatchToken = AppDispatcher.register(_.bind(this.dispatchCallback, this));
	
		// Detect if it is possible to extract the document from a preexisting documentList instance:
		if (typeof app.documentList !== 'undefined') {
			currentDocument = app.documentList.get(parseInt(id));
			app.currentDocumentView = new DocumentView(currentDocument);
			app.currentDocumentView.render();
			AppDispatcher.dispatch({actionType: 'route:ready' });
		} else {
			currentDocument = new Document({'id': id});
			currentDocument.fetch().then(function() {
				app.currentDocumentView = new DocumentView(currentDocument);
				app.currentDocumentView.render();
				AppDispatcher.dispatch({actionType: 'route:ready' });
			});
		}
	}
	
	return DocumentRoute;
});