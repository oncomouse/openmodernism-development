define([
	'jquery',
	'lodash',
	'react',
	'mixins/publish-component-mount/PublishComponentMountMixin',
	'mixins/login-dependent/LoginDependentMixin',
	'components/document/short_view',
	'jquery-ui/sortable',
	'postal.request-response'
], function(
	$,
	_,
	React,
	PublishComponentMountMixin,
	LoginDependentMixin,
	DocumentShortView
) {
	var Anthology = React.createClass({
		mixins: [
			PublishComponentMountMixin
		],
		propTypes: {
			model: function(props, propName, componentName) { return (_.has(props, propName) && typeof props[propName].get === 'function' && typeof props[propName].set === 'function'); } /* Best we can do to check that model is a Backbone Model */
		},
		getInitialState: function() {
			this.channel = {};
			this.channel['component'] = postal.channel('component');
			this.channel['component'].subscribe('anthology:done_editing', _.bind(this.done_editing,this));
			return null;
		},
		done_editing: function(data, envelope) {
			
		},
		render: function() {
			var renderedChildren = 	_.map(this.props.model.documents, function (element) {
				return (<DocumentShortView model={element} key={JSON.stringify(element)}/>);
			});
			return(
				<div className="row">
					<section id="currentAnthology" className="anthology col-md-10 center-block">
						<hgroup className="anthology-metadata">
							<h1 id="anthology-title" dangerouslySetInnerHTML={{ __html: this.props.model.get('metadata').get('title').to_s() }} />
							<h2 id="anthology-author" dangerouslySetInnerHTML={{ __html: 'by ' + this.props.model.get('metadata').get('author').to_s(true) }} />
						</hgroup>
						<p className="text-center">
							<AnthologyEditButton/>
						</p>
						<ul id="anthology-contents" className="list-group">
							{renderedChildren}
						</ul>
					</section>
				</div>
			);
		}
	});
	
	var AnthologyEditButton = React.createClass({
		mixins: [
			React.addons.PureRenderMixin,
			LoginDependentMixin
		],
		getInitialState: function() {
			this.channel['component'] = postal.channel('component');
			return null;
		},
		toggleEdit: function(ev) {
			ev.stopPropagation();
			if($('#anthology-edit').html() == 'Done Editing') {
				$('.anthology-toc ul.list-group').sortable('disable');
				$('#anthology-edit').html('Edit This Anthology');
			} else {
				$('.anthology-toc ul.list-group').sortable({
					disabled: false,
					update: this.update_sortable
				});
				$('#anthology-edit').html('Done Editing');
				this.channel['component'].publish('anthology:done_editing', {});
			}
		},
		update_sortable: function() {
			this.channel['component'].publish('anthology:update_sortable', {});
		},
		render: function() {
			var content;
			if(this.state.loginStatus) {
				content = (
					<a class="btn btn-default btn-lg" id="anthology-edit" href="#">Edit This Anthology</a>
				);
				$('#AnthologyEditButton a').on('click', _.bind(this.toggleEdit, this));
			} else {
				$('#AnthologyEditButton a').off('click');
				content = (<span></span>);
			}
			
			return content;
		}
	});
	
	return Anthology;
});