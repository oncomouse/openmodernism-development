define([
	'jquery',
	'lodash',
	'react',
	'postal',
	'mixins/route-archiecture/RouteArchitectureMixin'
], function(
	$,
	_,
	React,
	postal,
	RouteArchitectureMixin
) {
	var LoginLink = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
			RouteArchitectureMixin
		],
		getInitialState: function() {
			this.channel['login'] = postal.channel('login');
			this.channel['login'].subscribe('change', _.bind(function(data, envelope) {
				if (this.isMounted()){
					this.setState({loginStatus: payload.loginStatus});
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
		clickLogout: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			this.channel['login'].publish('logout-request',{});
		},
		render: function() {
			var loginButton = <LoginButton onClick={this.clickLogin}/>;
			if(this.state.loginStatus) {
				loginButton = <LogoutButton onClick={this.clickLogout}/>;
			}
			return (
				loginButton
			);
		}
	});
	
	
	var LoginButton = React.createClass({
		render: function() {
			return (
				<li><a href="#" id="LoginLink" onClick={this.props.onClick}>Login</a></li>
			)
		}
	});
	
	var LogoutButton = React.createClass({
		render: function() {
			return (
				<li><a href="#" id="LoginLink" onClick={this.props.onClick}>Logout</a></li>
			)
		}
	})
	
	return LoginLink;
});
