define([
	'collections/anthology_collection',
	'views/anthology/anthologies_view',
	'models/anthology'
], function(AnthologyCollection, AnthologiesView, Anthology) {
	var AnthologiesRoute = function(app) {
		var fetch_collection = false;
		
		app.clearAppCanvas();
		
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
					app.router.trigger('ready');
				});
			});
		} else {
			$.when(app.anthologiesView.render(app.anthologyList)).done(function() {
				app.router.trigger('ready');
			});
		}
		
		app.router.trigger('ready');
	}
	
	return AnthologiesRoute;
});