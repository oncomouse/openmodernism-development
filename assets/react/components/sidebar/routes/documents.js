define([
	'react'
], function(
	React
) {
	var SidebarDocuments = React.createClass({
		mixins: [
			React.addons.PureRenderMixin
		],
		render: function() {
			return (
				<p>Foobar</p>
			);
		}
	});
	
	return SidebarDocuments;
})