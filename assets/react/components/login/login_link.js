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
				//rendered: false,
				loginStatus: false
			}
		},
		componentDidMount: function () {			
		},
		dispatchCallback: function(payload) {
			switch(payload.actionType) {
				case 'login:change':
					if (this.isMounted()){
						this.setState({loginStatus: payload.loginStatus});
						this.render();
					}
					break;
				case 'route:ready':
					if(!this.isMounted()){
						React.render(
							<LoginLink />,
							$('nav .collapse ul.navbar-right').get(0)
						);
						//this.setState({rendered: true});
					}
					break;
			}
		},
		render: function() {
			var loginButton = <LoginButton/>;
			if(this.state.loginStatus) {
				loginButton = <LogoutButton/>;
			}
			return (<li>
				{loginButton}
			</li>);
		}
	});
	
	
	var LoginButton = React.createClass({
		render: function() {
			return (
				<a href="#" id="LoginLink">Login</a>
			)
		}
	});
	
	var LogoutButton = React.createClass({
		render: function() {
			return (
				<a href="#" id="LoginLink">Logout</a>
			)
		}
	})
	
	return LoginLink;
});
