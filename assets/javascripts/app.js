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
			$('body').append(_.map(['xs','sm','md','lg'], function(size) { 
				//add the test to has.js:
				has.add('screen-' + size, function() { return $('body > .visible-'+size+'-block').css('display') === 'block';});
				
				return '<div class="visible-'+size+'-block"></div>'; // Add the element
			}).join(''));
			
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