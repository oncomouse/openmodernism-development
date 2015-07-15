'use strict';

define([
	'jquery',
	'backbone',
	'jst',
	'dispatcher',
	'bootstrap/modal'
], function($,Backbone,JST,AppDispatcher) {
	var LoginLinkView = Backbone.View.extend({
		tagName: 'li',
		attributes: {
			'id': 'LoginLinkListItem'
		},
		events: {
			'click #LoginLink': 'show_modal'
		},
		template: JST['login/login_link'],
		render: function() {
			this.$el.html(this.template({model: this.model}));
			return this;
		},
		initialize: function() {
			
			this.dispatchToken = AppDispatcher.register(_.bind(this.dispatchCallback, this));
			
			$('nav .collapse ul.navbar-right').append(
				this.render().el
			);
		},
		dispatchCallback: function(payload) {
			switch(payload.actionType) {
				case 'login:change':
					this.render();
					break;
			}
		},
		show_modal: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
		
			$('#LoginModal').modal('show');
			
			return false;
		},
	});
	
	return LoginLinkView;
});