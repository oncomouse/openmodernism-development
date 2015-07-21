define([
	'lodash',
	'react',
	'mixins/publish-component-mount/PublishComponentMountMixin'
], function (
	_,
	React,
	PublishComponentMountMixin
) {
	var Sidebar = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
			PublishComponentMountMixin
		],
		routes: [
			'documents',
			'anthologies'
		],
		getDefaultProps: function() {
			return {
				cols: 5,
				affix: true,
				route: null
			};
		},
		renderSidebar: function() {
			var output;
			
			if(_.includes(this.routes, this.props.route)) {
				require(['react', 'components/sidebar/routes/' + this.props.route], _.bind(function(React, ReactComponent) {
					React.render(
						React.createElement(ReactComponent, this),
						$('.sidebar-body .sidebar-mountpoint').get(0)
					);
				}, this.props));
			}
			
			return (<div className="sidebar-mountpoint" />);
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
