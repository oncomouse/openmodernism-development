define([
	'jquery',
	'underscore',
	'backbone',
	'jst',
	'utilities/alert_manager',
	'bootstrap/modal'
], function($,_,Backbone,JST, AlertManager) {
	var LoginView = Backbone.View.extend({
		el: 'body',
		template: JST['login/login_modal'],
		initialize: function() {
			this.render();
			
			// Attach the login modal tab manager:
			$('#LoginModal ul.nav a').click(_.bind(this.switch_pane, this));
			
			this.load_pane_template($('a[data-target="login-form"]'));
			
			// Handle form buttons submit:
			$('#LoginModal .submit').click(_.bind(this.handle_modal_submit, this));
			$('#LoginModal form').on('submit', _.bind(this.handle_modal_submit, this));
		},
		render: function() {
			this.$el.append(this.template());
			return this;
		},
		switch_pane: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			
			AlertManager.clear_alerts(true);
			$('.has-error').removeClass('has-error');
			$('.active input').val('');

			this.load_pane_template(ev.target);
			
			return false;
		},
		load_pane_template: function(target) {
			$('#LoginModal .active').removeClass('active');
			
			$('#LoginModalContent').html($('.templates .' + $(target).attr('data-target') + '.body').html());
			$('#LoginModal .modal-footer').html($('.templates .' + $(target).attr('data-target') + '.footer').html());
			
			$(target).parent().addClass('active');
			
			$('#LoginModal form').attr('action', '#' + $(target).attr('data-target'));
			
			$('#LoginModal').modal('handleUpdate');
		},
		handle_modal_submit: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			this.trigger('submit', ev);
			
			return false;
		},
		clear_modal: function() {
			$('#LoginModal input').val('');
			$('#LoginModal').modal('hide');
		}
	});
	
	return LoginView;
});