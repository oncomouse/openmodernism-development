define([
	'jquery',
	'backbone',
	'jst',
	'bootstrap/modal'
], function($,Backbone,JST) {
	var LoginView = Backbone.View.extend({
		el: 'body',
		template: JST['login/login_modal'],
		initialize: function() {
			this.render();
			
			// Attach the login modal tab manager:
			$('#LoginModal ul.nav a').click(this.switch_pane);
			
			// Handle form buttons submit:
			$('#LoginModal .submit').click(this.handle_modal_submit);
		},
		render: function() {
			this.$el.append(this.template());
			return this;
		},
		switch_pane: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			$('#LoginModal .active').removeClass('active');
			$('.' + $(this).attr('data-target')).addClass('active');
			$(this).parent().addClass('active');
			
			$('#LoginModal').modal('handleUpdate');
			
			return false;
		},
		handle_modal_submit: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			
			return false;
		}
	});
	
	return LoginView;
});