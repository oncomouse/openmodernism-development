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
			
			$('#LoginModal').on('hide.bs.modal', this.clean_modal);
		},
		render: function() {
			this.$el.append(this.template());
			return this;
		},
		clean_modal: function() {
			AlertManager.clear_alerts({now: true, target: '#LoginModal'});
			$('#LoginModal .has-error').removeClass('has-error');
			$('#LoginModal input').val('');
		},
		switch_pane: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			


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
		remove_modal: function() {
			$('#LoginModal').modal('hide');
		}
	});
	
	return LoginView;
});