define([
	'lodash',
	'react',
	'mixins/publish-component-mount/PublishComponentMountMixin',
	'components/sidebar/sidebar'
], function(
	_,
	React,
	PublishComponentMountMixin,
	Sidebar
) {
	var Anthologies = React.createClass({
		mixins: [
			PublishComponentMountMixin
		],
		getPropDefaults: function() {
			return {
				collection: []
			};
		},
		render: function() {
			return(
				<div className="row">
					<h1 className="col-xs-12">List of Available Anthologies <span className="subtitle"></span></h1>

					<AnthologyList collection={this.props.collection} />
					<Sidebar cols={5} attach={true} route="anthologies" />
				</div>
			);
		}
	});
	
	var AnthologyList = React.createClass({
		createChildren: function() {
			return _.map(this.props.collection.models, function (element) {
					return React.createElement(AnthologyShortView, {model: element, key: JSON.stringify(element)});
				});
		},
		render: function() {
			return (
				<ul id="AnthologiesView" className="col-md-7">
					{this.createChildren()}
				</ul>
			)
		}
	});
	
	var AnthologyShortView = React.createClass({
		render: function() {
			return(
				<li>
					<a href={ '#/anthology/' + this.props.model.id } dangerouslySetInnerHTML={{ __html: this.props.model.get('metadata').to_s() }} />
				</li>
			);
		}
	});
	
	return Anthologies;
});