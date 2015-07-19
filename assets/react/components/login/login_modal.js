define([
	'jquery',
	'lodash',
	'react',
	'postal',
	'mixins/route-architecture/RouteArchitectureMixin',
	'utilities/form_validation',
	'bootstrap/modal'
], function(
	$,
	_,
	React,
	postal,
	RouteArchitectureMixin,
	FormValidation
) {
	var LoginModal = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
			RouteArchitectureMixin
		],
		getInitialState: function() {
			if(typeof this.channel !== 'object') {
				this.channel = {};
			}
			this.channel['login'] = postal.channel('login');
			this.channel['component'] = postal.channel('component');
			
			this.channel['component'].subscribe('modal-change-tab', _.bind(this.changeModalTab,this));
			
			this.channel['login'].subscribe('show-modal', function(data, envelope) {
				$('#LoginModal').modal('show');
			});
			this.channel['login'].subscribe('submitted', _.bind(function(data, envelope) {
				this.removeModal();
			}, this));
			
			return {
				tab: 'login'
			};
		},
		mountComponent: function(data, envelope) {
			$('#LoginModal').on('hide.bs.modal', _.bind(this.cleanModal, this));
			$('body').append($('<div class="modal fade" id="LoginModal"></div>'));
			React.render(
				<LoginModal />,
				$('#LoginModal').get(0)
			);
		},
		componentDidMount: function() {
			this.hookupForm();
		},
		componentDidUpdate: function(prevProps, prevState) {
			this.hookupForm();
		},
		changeModalTab(data, envelope) {
			if(data.modal == 'LoginModal') {
				this.setState({tab: data.tab});
				FormValidation.clear_errors('#LoginModal form');
			}
		},
		cleanModal: function() {
			if ($('#LoginModal form').attr('action') != '#login-form') { this.load_pane_template('login-form'); }
			$('#LoginModal input').val('');
			FormValidation.clear_errors('#LoginModal form');
			this.channel['login'].publish('hide-modal', {});
		},
		removeModal: function() {
			$('#LoginModal').modal('hide');
		},
		hookupForm: function() {
			// Turn off form submission after the form validator:
			$('#LoginModal form').attr('data-nosubmit', 'data-nosubmit');
			
			// Hook up form validation:
			FormValidation.setup($('#LoginModal form'));
			
			// Trigger the modal submission handler when validation is finished:
			$('#LoginModal form').on('success.validation', _.bind(this.handleModalSubmit, this));
			
			// Resize the modal:
			$('#LoginModal').modal('handleUpdate');
		},
		handleModalSubmit: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			
			this.channel['login'].publish('submit', {
				event: ev,
				formType: this.state.tab
			});
		},
		render: function() {
			var title;
			switch(this.state.tab) {
				case 'login':
					title = 'Please Login';
					break;
				case 'create_user':
					title = 'Create Account';
					break;
				default:
					title = 'Error';
					break;
			}
			return (
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 className="modal-title">{title}</h4>
						</div>
						<LoginModalForm tab={this.state.tab} />
					</div>
				</div>
			);
		}
	});
	var LoginModalForm = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
		],
		propTypes: {
			tab: React.PropTypes.string.isRequired,
		},
		getInitialState: function() {
			if(typeof this.channel !== 'object') {
				this.channel = {};
			}
			this.channel['component'] = postal.channel('component');
			return null;
		},
		handleTabChange: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			
			if(!$(ev.target).parent().hasClass('active')) {
				this.channel['component'].publish('modal-change-tab', {
					modal: 'LoginModal',
					tab: $(ev.target).attr('data-tab')
				});
			}
		},
		render: function() {
			var loginFormContent, loginFooter;
			return (
				<form action={'#' + this.props.tab + '-form'}>
					<div className="modal-body">
						<ul className="nav nav-tabs">
							<li role="presentation" className={(this.props.tab == 'login') ? 'active' : ''}>
								<a href="#" className="login-modal-tab"	data-tab="login" onClick={this.handleTabChange}>Login</a>
							</li>
							<li role="presentation" className={(this.props.tab == 'create_user') ? 'active' : ''}>
								<a href="#" className="login-modal-tab"	data-tab="create_user" onClick={this.handleTabChange}>Create Account</a>
							</li>
						</ul>
						<div id="LoginModalContent" className="panel panel-default">
							<LoginModalFormContent tab={this.props.tab}/>
						</div>
					</div>
					<div className="modal-footer">
						<LoginModalFooter tab={this.props.tab}/>
					</div>
				</form>
			);
		}
	});
	
	var LoginModalFormContent = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
		],
		propTypes: {
			tab: React.PropTypes.string.isRequired,
		},
		render: function() {
			var formContent;
			switch(this.props.tab){
				case 'login':
					formContent = (
						<div className="login-form body">
							<div className="panel-body">
								<div className="form-group">
									<label className="control-label" htmlFor="email">Email Address:</label>
									<input type="email" className="form-control" id="email" placeholder="Email" required />
								</div>
								<div className="form-group">
									<label className="control-label" htmlFor="password">Password</label>
									<input type="password" className="form-control" id="password" placeholder="Password" required />
								</div>
							</div>
						</div>
					);
					break;
				case 'create_user':
					formContent = (
						<div className="create-form body">
							<div className="panel-body">
								<div className="form-group">
									<label className="control-label" htmlFor="name">Your Name:</label>
									<input type="input" className="form-control" id="name" placeholder="Name" required />
								</div>
								<div className="form-group">
									<label className="control-label" htmlFor="email">Email Address:</label>
									<input type="email" className="form-control" id="email" placeholder="Email" required />
								</div>
								<div className="form-group">
									<label className="control-label" htmlFor="password">Password</label>
									<input type="password" className="form-control" id="password" placeholder="Password" required data-match="password2" minLength="6" />
								</div>
								<div className="form-group">
									<label className="control-label" htmlFor="password2">Verify Password</label>
									<input type="password" className="form-control" id="password2" placeholder="Verify Password" required data-match="password" minLength="6" />
								</div>
							</div>
						</div>
					);
					break;
				default:
					formContent = (<div className="body"></div>);
					break;
			}
			return formContent;
		}
	});
	
	
	var LoginModalFooter = React.createClass({
		propTypes: {
			tab: React.PropTypes.string.isRequired,
		},
		render: function() {
			var footerContent;
			switch(this.props.tab) {
				case 'login':
					footerContent = (
						<div>
							<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary submit" data-action="login">Login</button>
						</div>
					);
					break;
				case 'create_user':
					footerContent = (
						<div>
							<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="submit" className="btn btn-primary submit" data-action="create">Create Account</button>
						</div>
					)
					break;
				default:
					footerContent = (<div className="body"></div>);
					break;
			}
		
			return footerContent;
		}
	});
	
	return LoginModal;
});