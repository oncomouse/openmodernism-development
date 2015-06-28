(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('jquery'), require('backbone'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['jquery', 'backbone', 'jst', 'bootstrap/affix'], factory);
	}
	// Browser
	else if (typeof $ !== 'undefined' && typeof Backbone !== 'undefined') {
		window.SidebarView = factory($, Backbone, JST);
	}

}(function ($,Backbone, JST) {
	var SidebarView = Backbone.View.extend({
		route: 'default',
		routesWeCareAbout: { // key is route name and value is template
			'documents': JST['sidebars/documents']
		},
		initialize: function(router) {
			// Probably attach a login manager or something
		},
		changeRoute: function(route) {
			this.route = route;
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
}));