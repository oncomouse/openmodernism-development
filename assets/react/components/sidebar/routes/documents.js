define([
	'react'
], function(
	React
) {
	var SidebarDocument = React.createClass({
		mixins: [
			React.addons.PureRenderMixin
		],
		render: function() {
			return (
				<p>Foobar</p>
			);
		}
	});
	
	return SidebarDocument;
})