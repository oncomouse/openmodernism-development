define([
	'lodash',
	'react',
	'mixins/publish-component-mount/PublishComponentMountMixin',
	'components/sidebar/routes/documents',
	'components/sidebar/routes/anthologies'
], function (
	_,
	React,
	PublishComponentMountMixin,
	SidebarDocuments,
	SidebarAnthologies
) {
	var Sidebar = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
			PublishComponentMountMixin
		],
		routes: {
			'documents': SidebarDocuments,
			'anthologies': SidebarAnthologies
		},
		getDefaultProps: function() {
			return {
				cols: 5,
				affix: true,
				route: null
			};
		},
		renderSidebar: function() {
			var output;
			
			if(_.has(this.routes, this.props.route)) {
				output = React.createElement(this.routes[this.props.route], this.props);
			}
			
			return output;
		},
		render: function() {
			return (
				<aside className={'sidebar col-md-' + this.props.cols} data-affix={this.props.affix}>
					<div className='sidebar-body'>
						{this.renderSidebar()}
					</div>
				</aside>
			);
		}
	});
	
	return Sidebar;
});
