define([
	'jquery',
	'underscore',
	'backbone',
	'dispatcher',
	'views/sidebar_view',
	'utilities/login_manager',
	'utilities/form_validation',
	'jquery-ui/effect-blind'
], function(
	$,
	_,
	Backbone,
	AppDispatcher,
	SidebarView,
	LoginManager,
	FormValidation
){
	var Router = Backbone.Router.extend({
		routeReady: function() {				
			$('body').addClass('loaded');
			$('#loading .fa-spin').removeClass('fa-spin');
			$('#loading').hide('blind', {}, 500);
			
			FormValidation.setup();
		},
		dispatchCallback: function(payload) {
			switch(payload.actionType) {
				case 'route:ready':
					this.routeReady();
					break;
				case 'route':
					require(['routes/'+payload.route], _.bind(function(route) {
						route(this.context, payload.params);
					}, this));
					break;
			}
		},
		// Initialization code to run every time a route is rendered (similar to $(document).ready on a normal web page):
		initialize: function(options) {
			options || (options = {});
			
			this.context = options.context;
			
			_.each(this.routes, function(val, key) {
				if (key == '') { return; }
				this.on('route:' + val, function(params) {
					AppDispatcher.dispatch({
						actionType: 'route',
						params: params,
						route: val
					});
				});
			}, this);
			
			this.dispatchToken = AppDispatcher.register(_.bind(this.dispatchCallback, this));
			this.sidebar = new SidebarView();
			
			this.login_manager = new LoginManager();
			

		}
	});
	return Router;
});