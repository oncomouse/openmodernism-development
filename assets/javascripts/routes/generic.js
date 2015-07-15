'use strict';

define([
	'dispatcher'
	// Libraries go here:
], function(
	AppDispatcher
) {
	var GenericRoute = function(app) {
		app.clearAppCanvas();
		
		// Your code goes here:
		
		AppDispatcher.dispatch({actionType: 'route:ready' });
	}
	return GenericRoute;
});