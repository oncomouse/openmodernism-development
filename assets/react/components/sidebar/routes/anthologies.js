define([
	'react'
], function(
	React
) {
	var SidebarAnthologies = React.createClass({
		mixins: [
			React.addons.PureRenderMixin
		],
		render: function() {
			return (
				<p>Foobar</p>
			);
		}
	});
	
	return SidebarAnthologies;
})