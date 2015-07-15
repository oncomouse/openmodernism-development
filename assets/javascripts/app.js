'use strict';

define([
	'jquery',
	'lodash',
	'backbone',
	'dispatcher',
	'lorem',
	'router',
	'bootstrap/transition',
	'bootstrap/collapse'
],function(
	$,
	_,
	Backbone,
	AppDispatcher,
	Lorem,
	Router
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