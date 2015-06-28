define([
], function(

) {
	var GenericRoute = function(app) {
		app.clearAppCanvas();
		app.router.trigger('ready router:ready');
	}
	return GenericRoute;
});