'use strict';

define([
	'jquery',
	'lodash',
	'backbone',
	'router',
	'bootstrap/transition',
	'bootstrap/collapse'
],function(
	$,
	_,
	Backbone,
	Router
){
	var start = function() {
		var DEBUG = true;

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

		$(document).ready(function() {
			// Generate the router:
			app.router = new Router({routes: app.routes, context: app});

			if (window.development && DEBUG) {
				require([
					'postal.diagnostics'
				], function(DiagnosticsWireTap) {
					var dwt = new DiagnosticsWireTap({
						name: 'console',
						writer: function(output) { console.log(output); }
					});
				});
				/*app.router.on('all', function(route, params) {
					console.log('Route', arguments);
				});
				Backbone.Model.prototype.trigger = function() {
					console.log('Event', arguments);
					Backbone.Events.trigger.apply(this, arguments);
				}*/
			}

			Backbone.history.start();

		});
	};
	return {
		'start': start
	}
});