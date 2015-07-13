'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone', 'writedown', 'models/metadata/object'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined' && typeof Writedown && typeof MetadataObject !== 'undefined') {
		window.MetadataTitle = factory(Backbone, Writedown, MetadataObject);
	}

}(function (Backbone, Writedown, MetadataObject) {
	var MetadataTitle = MetadataObject.extend({
		initialize: function(title) {
			title || (title = this.defaults.original);
			this.attributes['original'] = title;
			if (typeof title === 'string') {
				this.attributes['string'] = Writedown.html(this.attributes['original']);
			} else {
				this.attributes['string'] = "Error Parsing Title";
			}
		}
	});
	return MetadataTitle;
}));