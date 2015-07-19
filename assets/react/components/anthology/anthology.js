define([
	'lodash',
	'react',
	'mixins/publish-component-mount/PublishComponentMountMixin'
], function(
	_,
	React,
	PublishComponentMountMixin
) {
	var Anthology = React.createClass({
		mixins: [
			PublishComponentMountMixin
		],
		propTypes: {
			model: function(props, propName, componentName) { return (_.has(props, propName) && typeof props[propName].get === 'function' && typeof props[propName].set === 'function'); } /* Best we can do to check that model is a Backbone Model */
		},
		render: function() {
			return(
				<div className="row">
					<section id="currentAnthology" className="anthology col-md-10 center-block">
						<hgroup className="anthology-metadata">
							<h1 id="anthology-title" dangerouslySetInnerHTML={{ __html: this.props.model.get('metadata').get('title').to_s() }} />
							<h2 id="anthology-author" dangerouslySetInnerHTML={{ __html: 'by ' + this.props.model.get('metadata').get('author').to_s(true) }} />
						</hgroup>
						<div id="anthology-content" dangerouslySetInnerHTML={{__html: this.props.model.get('text')}} />
					</section>
				</div>
			);
		}
	});
	
	return Anthology;
});