'use strict';

define([
	'jquery',
	'collections/document_collection',
	'components/document/documents',
	'postal',
	'react'
], function(
	$,
	DocumentCollection,
	Documents,
	postal,
	React
) {
	var DocumentsRoute = function(app) {
		var fetch_collection = false;
		
		var channel = {};
		channel['route'] = postal.channel('route');
	
		if(!('documentList' in app)) {
			fetch_collection = true;
			app.documentList = new DocumentCollection();
		}
		/*if(!('documentsView' in app)) {
			app.documentsView = new DocumentsView();
		}*/
		if(fetch_collection) {
			app.documentList.fetch().then(function() { 
				React.render(React.createElement(Documents, {collection: app.documentList}), $('#app').get(0));
				channel['route'].publish('ready');
			});
		} else {
			/*$.when(app.documentsView.render(app.documentList)).done(function() {
				channel['route'].publish('ready');
			});*/
			React.render(React.createElement(Documents, {collection: app.documentList}), $('#app').get(0));
			channel['route'].publish('ready');
		}
	}
	return DocumentsRoute;
});