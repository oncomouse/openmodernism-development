'use strict';

define([
	// Libraries go here:
], function(

) {
	var GenericRoute = function(app) {
		app.clearAppCanvas();
		
		// Your code goes here:
		
		app.router.trigger('ready router:ready');
	}
	return GenericRoute;
});