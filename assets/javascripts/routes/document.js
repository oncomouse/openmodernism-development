'use strict';

define([
	'models/document',
	'views/document/document_view',
	'postal'
], function(
	Document,
	DocumentView,
	postal
) {
	var DocumentRoute = function(app, id) {
		var currentDocument = {};
	
		app.clearAppCanvas();
		var channel = {};
		channel['route'] = postal.channel('route');
	
		// Detect if it is possible to extract the document from a preexisting documentList instance:
		if (typeof app.documentList !== 'undefined') {
			currentDocument = app.documentList.get(parseInt(id));
			app.currentDocumentView = new DocumentView(currentDocument);
			app.currentDocumentView.render();
			channel['route'].publish('ready');
		} else {
			currentDocument = new Document({'id': id});
			currentDocument.fetch().then(function() {
				app.currentDocumentView = new DocumentView(currentDocument);
				app.currentDocumentView.render();
				channel['route'].publish('ready');
			});
		}
	}
	
	return DocumentRoute;
});