'use strict';

define([
	'jquery',
	'lodash',
	'collections/document_collection',
	'components/document/documents',
	'postal',
	'react'
], function(
	$,
	_,
	DocumentCollection,
	Documents,
	postal,
	React
) {
	var DocumentsRoute = function(app) {
		var fetch_collection = false;
		
		var channel = {};
		channel['route'] = postal.channel('route');
	
		if(!_.has(app,'documentList')) {
			fetch_collection = true;
			app.documentList = new DocumentCollection();
		}
		if(fetch_collection) {
			app.documentList.fetch().then(function() { 
				React.render(React.createElement(Documents, {collection: app.documentList}), $('#app').get(0));
				channel['route'].publish('ready');
			});
		} else {
			React.render(React.createElement(Documents, {collection: app.documentList}), $('#app').get(0));
			channel['route'].publish('ready');
		}
	}
	return DocumentsRoute;
});