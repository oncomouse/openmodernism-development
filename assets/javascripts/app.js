'use strict';

define([
	'jquery',
	'lodash',
	'backbone',
	'has',
	'router',
	'bootstrap/transition',
	'bootstrap/collapse'
],function(
	$,
	_,
	Backbone,
	has,
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
			
			// Attach screen size tests:
			_.each(['xs','sm','md','lg'], function(size) { 
				has.add('screen-' + size, function() { 
					var ret,new_el;

					new_el = $('<div class="visible-' + size + '-block"></div>');
					$('body').append(new_el);
					ret = new_el.css('display') === 'block';
					new_el.remove();
					return ret;
				});
			});
			
			has.add('screen-xs-up', function() { return true; });
			has.add('screen-sm-up', function() { return has('screen-sm') || has('screen-md') || has('screen-lg'); });
			has.add('screen-md-up', function() { return has('screen-md') || has('screen-lg'); });
			has.add('screen-lg-up', function() { return has('screen-lg'); });

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