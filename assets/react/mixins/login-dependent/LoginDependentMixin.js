define([
	'lodash',
	'react',
	'postal',
	'postal.request-response'
], function(
	_,
	React,
	postal
) {
	var LoginDependentMixin = {
		getInitialState: function() {
			// We need to tell postal how to get a deferred instance
			postal.configuration.promise.createDeferred = function() {
			    return new $.Deferred();
			};
			// We need to tell postal how to get a "public-facing"/safe promise instance
			postal.configuration.promise.getPromise = function(dfd) {
			    return dfd.promise();
			};
			
			if(typeof this.channel !== 'object') {
				this.channel = {};
			}
			if(!_.has(this.channel, 'login')) {
				this.channel['login'] = postal.channel('login');
			}
			this.channel['login'].subscribe('change', _.bind(function(data, envelope) {
				if (this.isMounted()){
					this.setState({loginStatus: data.loginStatus});
				}
			}, this));
			return {
				loginStatus: false
			}
		},
		componentDidMount: function() {
			this.channel['login'].request({topic: 'authenticated?'}).then(_.bind(function(data) {
				this.setState({loginStatus: data.authenticated});
			}, this));
		},
	};
	
	return LoginDependentMixin;
});