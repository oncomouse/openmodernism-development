'use strict';

define([
	'backbone',
	'jst'
],function (
	Backbone,
	JST
) {
	var AnthologyShortView = Backbone.View.extend({
		tagName: 'li',
		template: JST['anthology/anthology_shortview'],//_.template($('#documents-document_shortview').html()),
		render: function() {
			this.$el.html(this.template({ model: this.model }));
			return this;
		},
		initialize: function() {
			this.model.on('change', this.render, this);
		}
	});
	return AnthologyShortView;
});