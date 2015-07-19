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
	var Documents = React.createClass({
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
					<h1 className="col-xs-12">List of Available Documents <span className="subtitle"></span></h1>

					<DocumentList collection={this.props.collection} />
					<Sidebar cols={5} attach={true} route="documents" />
				</div>
			);
		}
	});
	
	var DocumentList = React.createClass({
		createChildren: function() {
			return _.map(this.props.collection.models, function (element) {
					return React.createElement(DocumentShortView, {model: element, key: JSON.stringify(element)});
				});
		},
		render: function() {
			return (
				<ul id="DocumentsView" className="col-md-7">
					{this.createChildren()}
				</ul>
			)
		}
	});
	
	var DocumentShortView = React.createClass({
		render: function() {
			return(
				<li>
					<a href={ '#/document/' + this.props.model.id } dangerouslySetInnerHTML={{ __html: this.props.model.get('metadata').to_s() }} />
				</li>
			);
		}
	});
	
	return Documents;
});