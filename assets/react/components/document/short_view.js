define([
	'lodash',
	'react'
], function(
	_,
	React
) {
	var DocumentShortView = React.createClass({
		render: function() {
			return(
				<li>
					<a href={ '#/document/' + this.props.model.id } dangerouslySetInnerHTML={{ __html: this.props.model.get('metadata').to_s() }} />
				</li>
			);
		}
	});
	
	return DocumentShortView;
});