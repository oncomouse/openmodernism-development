'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'jst',
	'dispatcher',
	'utilities/form_validation',
	'bootstrap/modal'
], function($,_,Backbone,JST,AppDispatcher,FormValidation) {
	var LoginView = Backbone.View.extend({
		el: 'body',
		template: JST['login/login_modal'],
		initialize: function() {
			this.render();
			
			// Attach the login modal tab manager:
			$('#LoginModal ul.nav a').click(_.bind(this.switch_pane, this));
			// and load the default pane:
			this.load_pane_template('login-form');
			
			this.dispatchToken = AppDispatcher.register(_.bind(this.dispatchCallback, this));
			
			// If the LoginModal starts to close, clear it's contents:
			$('#LoginModal').on('hide.bs.modal', _.bind(this.clean_modal, this));
		},
		render: function() {
			this.$el.append(this.template());
			return this;
		},
		dispatchCallback: function(payload) {
			switch(payload.actionType) {
				case 'login:submitted':
					this.remove_modal();
					break;
			}
		},
		clean_modal: function() {
			if ($('#LoginModal form').attr('action') != '#login-form') { this.load_pane_template('login-form'); }
			$('#LoginModal input').val('');
			FormValidation.clear_errors('#LoginModal form');
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
			
			// Turn off form submission after the form validator:
			$('#LoginModal form').attr('data-nosubmit', 'data-nosubmit');
			
			// Hook up form validation:
			FormValidation.setup($('#LoginModal form'));
			
			// Trigger the modal submission handler when validation is finished:
			$('#LoginModal form').on('success.validation', _.bind(this.handle_modal_submit, this));
			
			// Resize the modal:
			$('#LoginModal').modal('handleUpdate');
		},
		handle_modal_submit: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();

			// Signal to the LoginManager that we have a form submission:
			AppDispatcher.dispatch({
				actionType: 'login:submit',
				event: ev
			});
			
			return false;
		},
		remove_modal: function() {
			$('#LoginModal').modal('hide');
		}
	});
	
	return LoginView;
});