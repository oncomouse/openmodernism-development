'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('underscore'), require('backbone'), require('sprintf'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['underscore','backbone','sprintf', 'models/metadata/object'], factory);
	}
	// Browser
	else if (typeof _ !== 'undefined' && typeof Backbone !== 'undefined' && typeof sprintf !== 'undefined' && typeof MetadataObject !== 'undefined') {
		window.MetadataAuthor = factory(_,Backbone,sprintf, MetadataObject);
	}

}(function (_,Backbone, sprintf, MetadataObject) {
	var MetadataAuthor = MetadataObject.extend({
		defaults: {
			orignal: ""
		},
		initialize: function(author) {
			author || (author = this.defaults.orignal);
			this.attributes['original'] = author;
		},
		to_s: function(givenFirst) {
			var output = '';
			if(typeof this.attributes['original'] === 'string') {
				output = this.attributes['original'];
			} else if(typeof this.attributes['original'] === 'object') {
				if (this.attributes['original'] instanceof Array) {
					
					output = givenFirst ? sprintf('%s %s', this.attributes['original'][0]['given'], this.attributes['original'][0]['family']) : sprintf('%s, %s', author[0]['family'], author[0]['given']);
					if(this.attributes['original'].length > 1) {
						if(this.attributes['original'].length > 2) {
							output += ', ' + _.range(1, this.attributes['original'].length - 1).map(function(i) { sprintf('%s %s', this.attributes['original'][i]['given'], this.attributes['original'][i]['family']); }).join(',');
						}
						output += sprintf(', and %s %s', _.last(this.attributes['original'])['given'], _.last(this.attributes['original'])['family']);
					}
				} else if ('family' in author && 'given' in this.attributes['original']) {
					output = givenFirst ? sprintf('%s %s', this.attributes['original']['given'], this.attributes['original']['family']) : sprintf('%s, %s', author['family'], author['given']);
				} else {
					output = "Error Parsing Author";
				}
			}
			return output;
		}
	});
	return MetadataAuthor;
}));