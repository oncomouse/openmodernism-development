define([
	'jquery',
	'lodash',
	'react',
	'postal'
], function(
	$,
	_,
	React,
	postal
) {
	var LoginLink = React.createClass({
		getInitialState: function() {
			this.channel = {};
			this.channel['login'] = postal.channel('login');
			this.channel['route'] = postal.channel('route');
			this.channel['login'].subscribe('change', _.bind(function(data, envelope) {
				if (this.isMounted()){
					this.setState({loginStatus: payload.loginStatus});
					this.render();
				}
			}, this));
			this.channel['route'].subscribe('ready', _.bind(function(data, envelope) {
				if(!this.isMounted()){
					React.render(
						<LoginLink />,
						$('nav .collapse ul.navbar-right').get(0)
					);
					//this.setState({rendered: true});
				}
			}, this));
			return {
				loginStatus: false
			}
		},
		componentDidMount: function () {			
		},
		clickLogin: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			this.channel['login'].publish('show-modal',{});
		},
		render: function() {
			var loginButton = <LoginButton onClick={this.clickLogin}/>;
			if(this.state.loginStatus) {
				loginButton = <LogoutButton onClick={function() {}}/>;
			}
			return (<li>
				{loginButton}
			</li>);
		}
	});
	
	
	var LoginButton = React.createClass({
		render: function() {
			return (
				<a href="#" id="LoginLink" onClick={this.props.onClick}>Login</a>
			)
		}
	});
	
	var LogoutButton = React.createClass({
		render: function() {
			return (
				<a href="#" id="LoginLink" onClick={this.props.onClick}>Logout</a>
			)
		}
	})
	
	return LoginLink;
});
