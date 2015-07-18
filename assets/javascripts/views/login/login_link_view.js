'use strict';

define([
	'jquery',
	'backbone',
	'jst',
	'postal',
	'bootstrap/modal'
], function($,Backbone,JST,postal) {
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
			$('nav .collapse ul.navbar-right').append(
				this.render().el
			);
			this.channel = {};
			this.channel['login'] = postal.channel('login');
			this.channel['login'].subscribe('change', _.bind(function(data, envelope) {
				this.render();
			}, this));
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