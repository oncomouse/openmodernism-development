define([
	'jquery',
	'backbone',
	'jst',
	'bootstrap/modal'
], function($,Backbone,JST) {
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
			this.$el.html(this.template({authenticated: this.model.authenticated()}));
			return this;
		},
		initialize: function() {
			$('nav .collapse ul.navbar-right').append(
				this.render().el
			);
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