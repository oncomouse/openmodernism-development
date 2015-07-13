'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('backbone'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['backbone'], factory);
	}
	// Browser
	else if (typeof Backbone !== 'undefined') {
		window.MetadataCollection = factory(Backbone);
	}

}(function (Backbone) {
	var MetadataCollection = Backbone.Collection.extend({
		model: Metadata,
		localStorage: new Store("anthology-jammr-metadata-cache"),
		retreive: function(metadata) {
			
		}
	});
	return MetadataCollection;
}));