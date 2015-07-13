'use strict';

define([
	'backbone',
	'views/anthology/anthology_short_view',
	'jst'
], function (
	Backbone,
	AnthologyShortView,
	JST
) {
	var AnthologiesView = Backbone.View.extend({
		el: '#app',
		template: JST['anthology/anthologies'],
		render: function(anthologyList) {
			this.$el.html(this.template());
			this.$('#AnthologiesView').html('');
			anthologyList.each(function(element) {
				var view = new AnthologyShortView({model: element});
				$('#AnthologiesView').append(view.render().el);
			});
		}
	});
	
	return AnthologiesView;
});