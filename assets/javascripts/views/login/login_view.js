define([
	'jquery',
	'underscore',
	'backbone',
	'jst',
	'utilities/alert_manager',
	'bootstrap/modal'
], function($,_,Backbone,JST,AlertManager) {
	var LoginView = Backbone.View.extend({
		el: 'body',
		template: JST['login/login_modal'],
		initialize: function() {
			this.render();
			
			// Attach the login modal tab manager:
			$('#LoginModal ul.nav a').click(_.bind(this.switch_pane, this));
			// and load the default pane:
			this.load_pane_template('login-form');
			
			// If the LoginModal starts to close, clear it's contents:
			$('#LoginModal').on('hide.bs.modal', _.bind(this.clean_modal, this));
		},
		render: function() {
			this.$el.append(this.template());
			return this;
		},
		clean_modal: function() {
			if ($('#LoginModal form').attr('action') != '#login-form') { this.load_pane_template('login-form'); }
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
			if (typeof target === 'string') {
				target = $('a[data-target="' + target + '"]');
			}
			// Switch active tab:
			$('#LoginModal .active').removeClass('active');
			$(target).parent().addClass('active');
			
			// Load active pane content from template:
			$('#LoginModalContent').html($('.templates .' + $(target).attr('data-target') + '.body').html());
			$('#LoginModal .modal-footer').html($('.templates .' + $(target).attr('data-target') + '.footer').html());
			
			// Set form method to current action:
			$('#LoginModal form').attr('action', '#' + $(target).attr('data-target'));
			
			// Handle form buttons submit:
			$('#LoginModal .submit').off('click').click(_.bind(this.handle_modal_submit, this));
			$('#LoginModal form').off('submit').on('submit', _.bind(this.handle_modal_submit, this));
			
			// Resize the modal:
			$('#LoginModal').modal('handleUpdate');
		},
		handle_modal_submit: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			// Signal to the LoginManager that we have a form submission:
			this.trigger('submit', ev);
			
			return false;
		},
		remove_modal: function() {
			$('#LoginModal').modal('hide');
		}
	});
	
	return LoginView;
});