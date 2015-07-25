define([
	'lodash',
	'jquery',
	'react',
	'postal',
	'mixins/login-dependent/LoginDependentMixin',
	'postal.request-response'
], function(
	_,
	$,
	React,
	postal,
	LoginDependentMixin
) {
	var SidebarDocuments = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
			LoginDependentMixin
		],
		getInitialState: function() {
			this.channel['component'] = postal.channel('component');
			return null;
		},
		render: function() {
			var content;
			if(this.state.loginStatus) {
				content = (
					<p>Logged In</p>
				);
			} else {
				content = (
					<p>Foobar</p>
				);
			}
			
			return content;
		}
	});
	
	return SidebarDocuments;
})