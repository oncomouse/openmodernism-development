'use strict';

define([
	'collections/anthology_collection',
	'views/anthology/anthologies_view',
	'models/anthology',
	'postal'
], function(AnthologyCollection, AnthologiesView, Anthology, postal) {
	var AnthologiesRoute = function(app) {
		var fetch_collection = false;
		
		var channel = {};
		channel['route'] = postal.channel('route');
		
		window.Anthology = Anthology;
		
		if(!('anthologyList' in app)) {
			fetch_collection = true;
			app.anthologyList = new AnthologyCollection();
		}
		if(!('anthologiesView' in app)) {
			app.anthologiesView = new AnthologiesView();
		}
		if(fetch_collection) {
			app.anthologyList.fetch().then(function() { 
				$.when(app.anthologiesView.render(app.anthologyList)).done(function() {
					console.log(app.anthologyList);
					//app.router.trigger('ready');
					channel['route'].publish('ready');
				});
			});
		} else {
			$.when(app.anthologiesView.render(app.anthologyList)).done(function() {
				channel['route'].publish('ready');
			});
		}
	}
	
	return AnthologiesRoute;
});