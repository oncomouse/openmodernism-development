define([
	'jquery',
	'underscore',
	'backbone',
	'postal',
	'react',
	'views/sidebar_view',
	'utilities/login_manager',
	'utilities/form_validation',
	'jquery-ui/effect-blind'
], function(
	$,
	_,
	Backbone,
	postal,
	React,
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
		// Initialization code to run every time a route is rendered (similar to $(document).ready on a normal web page):
		initialize: function(options) {
			options || (options = {});
			
			this.context = options.context;
		
			this.channel = {};
			this.channel['route'] = postal.channel('route');
			
			this.channel['route'].subscribe('ready', _.bind(function(data, envelope) {
				this.routeReady();
			}, this));
			
			this.channel['route'].subscribe('change', _.bind(function(data, envelope) {
				
				React.unmountComponentAtNode($('#app').get(0));
				
				require(['routes/'+data.route], _.bind(function(route) {
					route(this.context, data.params);
				}, this));
			}, this));
			
			_.each(this.routes, function(val, key) {
				if (key == '') { return; }
				this.on('route:' + val, function(params) {
					this.channel['route'].publish('change',{
						params: params,
						route: val
					});
				});
			}, this);
			
			this.sidebar = new SidebarView();
			this.login_manager = new LoginManager();
			

		}
	});
	return Router;
});