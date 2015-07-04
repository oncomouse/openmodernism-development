define([
	'jquery',
	'lodash',
	'backbone',
	'lorem',
	'views/sidebar_view',
	'jquery-ui/effect-blind',
	'bootstrap/transition',
	'bootstrap/collapse'
],function(
	$,
	_,
	Backbone,
	Lorem,
	SidebarView
){
	var start = function() {
		var DEBUG = false;

		var app = {};

		app.routes = {
			'': 'documents', // SET THIS TO THE DEFAULT ROUTE
			'documents': 'documents',
			'document/:id': 'document',
			'anthologies': 'anthologies'
		};

		app.clearAppCanvas = function() {
			$('#app').html('');
		}

		var Router = Backbone.Router.extend({
			routeReady: function() {				
				$('body').addClass('loaded');
				$('#loading').hide('blind', {}, 500);
			},
			// Initialization code to run every time a route is rendered (similar to $(document).ready on a normal web page):
			initialize: function(options) {
				options || (options = {});
				_.each(this.routes, function(val, key) {
					if (key == '') { return; }
					this.on('route:' + val, function(params) {
						require(['routes/'+val], function(route) { 
							route(app, params);
						});
					});
				}, this);
				this.on('ready', function() {
					this.routeReady();
				});
				this.sidebar = new SidebarView();
				this.sidebar.listenTo(this, 'route', function(route,params) {
					this.changeRoute(route);
				});
				this.sidebar.listenTo(this, 'ready', function() {
					this.render();
				});
			}
		});

		$(document).ready(function() {
			// Generate the router:
			app.router = new Router({routes: app.routes, context: app});

			if (DEBUG) {
				app.router.on('all', function(route, params) {
					console.log('Route', arguments);
				});
				Backbone.Model.prototype.trigger = function() {
					console.log('Event', arguments);
					Backbone.Events.trigger.apply(this, arguments);
				}
			}

			Backbone.history.start();

		});
	};
	return {
		'start': start
	}
});