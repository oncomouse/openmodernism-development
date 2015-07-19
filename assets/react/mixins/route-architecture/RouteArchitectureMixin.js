define([
	'react',
	'postal'
],function(
	React,
	postal
) {
	var RouteArchitectureMixin = {
		getInitialState: function() {
			if(typeof this.channel !== 'object') {
				this.channel = {};
			}
			this.channel['route'] = postal.channel('route');
			this.channel['route'].subscribe('ready', _.bind(function(data, envelope) {
				if(!this.isMounted()){
					if(typeof this.mountComponent === 'function') {
						this.mountComponent();
					}
				}
			}, this));
			
			return null;
		}
	};
	
	return RouteArchitectureMixin;
})