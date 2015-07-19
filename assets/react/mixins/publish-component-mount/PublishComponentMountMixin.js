define([
	'lodash',
	'react',
	'postal'
],function(
	_,
	React,
	postal
) {
	var PublishComponentMountMixin = {
		componentDidMount: function() {
			if(typeof this.channel !== 'object') {
				this.channel = {};
			}
			if(!_.has(this.channel, 'component')) {
				this.channel['component'] = postal.channel('component');
			}
			this.channel['component'].publish('mount', {
				component: this.constructor.displayName
			});
		}
	};
	
	return PublishComponentMountMixin;
});