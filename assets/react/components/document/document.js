define([
	'lodash',
	'react',
	'mixins/publish-component-mount/PublishComponentMountMixin'
], function(
	_,
	React,
	PublishComponentMountMixin
) {
	var Document = React.createClass({
		mixins: [
			PublishComponentMountMixin
		],
		propTypes: {
			model: function(props, propName, componentName) { return (_.has(props, propName) && typeof props[propName].get === 'function' && typeof props[propName].set === 'function'); } /* Best we can do to check that model is a Backbone Model */
		},
		render: function() {
			return(
				<div className="row">
					<section id="currentDocument" className="document col-md-10 center-block">
						<hgroup className="document-metadata">
							<h1 id="document-title" dangerouslySetInnerHTML={{ __html: this.props.model.get('metadata').get('title').to_s() }} />
							<h2 id="document-author" dangerouslySetInnerHTML={{ __html: 'by ' + this.props.model.get('metadata').get('author').to_s(true) }} />
						</hgroup>
						<div id="document-content" dangerouslySetInnerHTML={{__html: this.props.model.get('text')}} />
					</section>
				</div>
			);
		}
	});
	
	return Document;
});