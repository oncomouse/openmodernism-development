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
					React.render(
						<LoginLink />,
						$('nav .collapse ul.navbar-right').get(0)
					);
				}
			}, this));
		}
	};
	
	return RouteArchitectureMixin;
})