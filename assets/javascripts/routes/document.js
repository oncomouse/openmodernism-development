'use strict';

define([
	'models/document',
	//'views/document/document_view',
	'components/document/document',
	'react',
	'postal'
], function(
	Document,
	DocumentComponent,
	React,
	postal
) {
	var DocumentRoute = function(app, id) {
		var currentDocument = {};
	
		var channel = {};
		channel['route'] = postal.channel('route');
		channel['component'] = postal.channel('component');
	
		// Detect if it is possible to extract the document from a preexisting documentList instance:
		if (typeof app.documentList !== 'undefined') {
			currentDocument = app.documentList.get(parseInt(id));
			React.render(React.createElement(DocumentComponent, {model: currentDocument}), $('#app').get(0));
			channel['route'].publish('ready');
		} else {
			currentDocument = new Document({'id': id});
			currentDocument.fetch().then(function() {
				React.render(React.createElement(DocumentComponent, {model: currentDocument}), $('#app').get(0));
				channel['route'].publish('ready');
			});
		}
	}
	
	return DocumentRoute;
});