define([
	'views/login/login_view',
	'views/login/login_link_view',
	'utilities/alert_manager',
], function(
	LoginView,
	LoginLinkView,
	AlertManager
){
	var LoginManager = Backbone.Model.extend({
		initialize: function() {
			this.login_view = new LoginView({model: this});
			this.login_link_view = new LoginLinkView({model: this});
			
			this.login_view.render();
			this.login_link_view.render();
			
			// Connect Events:
			this.listenTo(this.login_view, 'submit', this.form_submit);
			this.login_view.listenTo(this, 'submitted', this.login_view.clear_modal);
		},
		authenticate: function() {
			this.trigger('change');
		},
		form_submit: function(ev) {
			var class_name;
			
			class_name = $(ev.target).eq(0).parent().attr('class').replace(/\s+active/,'');
			//$form = $('.modal-body .' + class_name + ' form').eq(0);
			
			switch(class_name) {
				case 'login-form':
					this.form_submit_login();
					break;
				case 'create-form':
					this.form_submit_create();
					break;
			}
			return false;
		},
		form_submit_login() {
			var form_values, $email_input, $password_input;
			var validation = true;
			
			$email_input = $('.panel-body.login-form').find('#email');
			$password_input = $('.panel-body.login-form').find('#password');
			
			if($email_input.get(0).validity.valid) {
				AlertManager.clear_alert('email-alert');
				$email_input.parent().removeClass('has-error')
			} else {
				if(!$email_input.parent().hasClass('has-error')) {
					AlertManager.show_alert({
						type: 'danger',
						message: 'Invalid Email Address',
						timeout: null,
						target: $email_input.parent().find('label'),
						dismissable: false,
						id: 'email-alert'
					});
					$email_input.parent().addClass('has-error');
				}
				validation = false;
			}
			
			if(validation) {
				form_values = {
					email: $email_input.val(),
					password: $password_input.val()
				};
				
				this.trigger('submitted');
			}
		},
		form_submit_create() {
			var form_values, $email_input, $password_input, $password2_input, $first_input;
			var validation = true;
			
			$email_input = $('.panel-body.create-form').find('#email');
			$password_input = $('.panel-body.create-form').find('#password');
			$password2_input = $('.panel-body.create-form').find('#password2');
			$first_input = $('.panel-body.create-form input').eq(0);
			
			if($email_input.get(0).validity.valid) {
				AlertManager.clear_alert('email-alert');
				$email_input.parent().toggleClass('has-error');
			} else {
				if(!$email_input.parent().hasClass('has-error')) {
					AlertManager.show_alert({
						type: 'danger',
						message: 'Invalid Email Address',
						timeout: null,
						target: $first_input.parent().find('label'),
						dismissable: false,
						id: 'email-alert'
					});
					$email_input.parent().toggleClass('has-error');
				}
				validation = false;
			}
			if($password_input.val() == $password2_input.val()) {
				AlertManager.clear_alert('password-alert');
				$password_input.parent().toggleClass('has-error');
				$password2_input.parent().toggleClass('has-error');
			} else {
				if(!$password_input.parent().hasClass('has-error')) {
					AlertManager.show_alert({
						type: 'danger',
						message: 'Passwords Must Match',
						timeout: null,
						target: $first_input.parent().find('label'),
						dismissable: false,
						id: 'password-alert'
					})
					$password_input.parent().toggleClass('has-error');
					$password2_input.parent().toggleClass('has-error');
				}
				validation = false;
			}
		},
		authenticated: function() {
			return false;
		}
	});
	
	return LoginManager;
})