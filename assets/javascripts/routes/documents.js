'use strict';

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
		var fetch_collection = false;
	
		app.clearAppCanvas();
	
		if(!('documentList' in app)) {
			fetch_collection = true;
			app.documentList = new DocumentCollection();
		}
		if(!('documentsView' in app)) {
			app.documentsView = new DocumentsView();
		}
		if(fetch_collection) {
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