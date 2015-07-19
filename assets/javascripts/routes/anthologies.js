'use strict';

define([
	'jquery',
	'lodash',
	'collections/anthology_collection',
	'components/anthology/anthologies',
	'postal',
	'react'
], function(
	$,
	_,
	AnthologyCollection,
	Anthologies,
	postal,
	React
) {
	var AnthologiesRoute = function(app) {
		var fetch_collection = false;
		
		var channel = {};
		channel['route'] = postal.channel('route');
	
		if(!_.has('anthologyList', app)) {
			fetch_collection = true;
			app.anthologytList = new AnthologyCollection();
		}
		if(fetch_collection) {
			app.anthologytList.fetch().then(function() { 
				React.render(React.createElement(Anthologies, {collection: app.anthologytList}), $('#app').get(0));
				channel['route'].publish('ready');
			});
		} else {
			React.render(React.createElement(Anthologies, {collection: app.anthologytList}), $('#app').get(0));
			channel['route'].publish('ready');
		}
	}
	return AnthologiesRoute;
});