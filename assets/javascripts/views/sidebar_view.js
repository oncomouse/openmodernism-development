'use strict';


define([
	'jquery',
	'backbone',
	'postal',
	'jst',
	'bootstrap/affix'
],function (
	$,
	Backbone,
	postal,
	JST
) {
	var SidebarView = Backbone.View.extend({
		route: 'default',
		routesWeCareAbout: { // key is route name and value is template
			'documents': JST['sidebars/documents']
		},
		initialize: function(router) {
			this.channel = {};
			this.channel['route'] = postal.channel('route');
			
			this.channel['route'].subscribe('ready', _.bind(function(data, envelope) {
				this.render();
			},this));
			this.channel['route'].subscribe('change', _.bind(function(data, envelope) {
				this.changeRoute(data.route);
			},this));
		},
		changeRoute: function(route) {
			this.route = route;
		},
		dispatchCallback: function(payload) {
			switch(payload.actionType) {
				case 'route:ready':
					this.render();
					break;
				case 'route':
					this.changeRoute(payload.route);
					break;
			}
		},
		render: function() {
			if(this.route in this.routesWeCareAbout) {
				$('.sidebar').html(this.routesWeCareAbout[this.route]());
				this.affix();
			} else if ($('.sidebar').length > 0) {
				$('.sidebar').html('');
			}
		},
		affix: function() {
			var s = $('.sidebar[data-affix=true]');
			if (s.length > 0) {
				s.affix({
					offset: {
						top: s.position().top,
						bottom: $('footer').outerHeight(true)
					}
				});
			}
		}
	});
	
	return SidebarView
});