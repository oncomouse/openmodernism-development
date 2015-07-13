'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('underscore'), require('backbone'), require('models/metadata/author'), require('models/metadata/title'), require('models/metadata/citation'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['underscore','backbone', 'jsyaml', 'models/metadata/author', 'models/metadata/title', 'models/metadata/citation'], factory);
	}
	// Browser
	else if (typeof _ !== 'undefined' && typeof Backbone !== 'undefined' && typeof jsyaml !== 'undefined' && typeof MetadataAuthor !== 'undefined' && typeof MetadataTitle !== 'undefined' && typeof MetadataCitation !== 'undefined') {
		window.Metadata = factory(_,Backbone, jsyaml, MetadataAuthor, MetadataTitle, MetadataCitation);
	}

}(function (_,Backbone, jsyaml, MetadataAuthor, MetadataTitle, MetadataCitation) {
	var Metadata = Backbone.Model.extend({
		defaults: {
			metadata: {}
		},
		initialize: function(metadata) {
			metadata || (metadata = {});
			this.updateMetadata(metadata);
		},
		updateMetadata: function(metadata) {
			if(typeof metadata === 'string') {
				metadata = jsyaml.safeLoad(metadata);
			}
			if(typeof metadata === 'undefined') {
				metadata = {};
			}

			if('title' in metadata) {
				metadata['title'] = new MetadataTitle(metadata['title']);
				//metadata['title'].on('change', function() { this.trigger('change change:metadata', metadata['title'], metadata['title'].get('original'), this) }, this);
			}
			if('author' in metadata) {
				metadata['author'] = new MetadataAuthor(metadata['author']);
				//metadata['author'].on('change', function() { this.trigger('change change:metadata', metadata['author'], metadata['author'].get('original'), this) }, this);
			}
			if('citation' in metadata) {
				metadata['citation'] = new MetadataCitation(metadata['citation'], metadata['author'].raw(), metadata['title'].raw());
				//metadata['citation'].on('change', function() { this.trigger('change change:metadata') }, this);
			}
			this.attributes['metadata'] = metadata;
		},
		toYaml: function() {
			var metadata = this.get('metadata'); // _.clone(this.get('metadata'));
			var output = {};
			_.each(_.keys(metadata), function(key) {
				var val = metadata[key];
				output[key] = (typeof val.raw !== 'undefined') ? val.raw() : val;
			});
			return jsyaml.safeDump(output);
		},
		to_s: function() {
			var metadata = this.get('metadata');
			var output = "";
			if ('citation' in metadata) {
				// Use citation, if available.
				// Also, as citeproc-js has the deliciously undocumented "feature" of automatically escaping HTML, add back HTML tags:
				output = metadata['citation'].to_s().replace(/\&\#60\;(\/{0,1})(em|strong|b|i|img|blockquote|a)(.*?)\&\#62\;/g, '<$1$2$3>');
			} else if ('title' in metadata && 'author' in metadata) {
				output = metadata['title'].to_s() + " by " + metadata['author'].to_s();
			}
			
			return output;
		},
		get: function(attr) {
			var output = this.attributes[attr];
			if(attr in this.attributes['metadata']) {
				output = this.attributes['metadata'][attr];
			}
			
			return output;
		}
	});
	return Metadata;
}));
	