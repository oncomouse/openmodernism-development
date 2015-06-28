(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('underscore'), require('backbone'), require('lorem'), require('models/metadata'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['underscore','backbone', 'lorem', 'models/metadata'], factory);
	}
	// Browser
	else if (typeof _ !== 'undefined' && typeof Backbone !== 'undefined' && typeof Lorem !== 'undefined' && typeof Metadata !== 'undefined') {
		window.Document = factory(_,Backbone, Lorem, Metadata);
	}

}(function (_,Backbone, Lorem, Metadata) {
	var Document = Backbone.Model.extend({
		urlRoot: '/document',
		idAttribute: 'id',
		defaults: {
			metadata: ''
		},
		get: function(attr) {
			output = this.attributes[attr];
			if(attr == 'metadata') {
				// Either grab the metadata JSON object from our cache:
				if('metadata_json' in this.attributes) {
					output = this.attributes['metadata_json'];
				// Or load it from the YAML string that comes from the API:
				} else {
					output = new Metadata(output);
					//this.set('metadata_json', output);
					this.attributes['metadata_json'] = output;
					this.trigger('change change:metadata');
					//this.listenTo(this.attributes['metadata_json'], 'change', function() { this.trigger('change change:metadata')});
				}
			}
			if (attr == 'text') {
				var lorem = new Lorem;
				lorem.type = Lorem.TEXT;
				lorem.query = '4-6p';
				output = lorem.createLorem();
			}
			return output;
		},
		set: function (key, val, options) {
			var self = this,
					attrs;
			if (key == null) return this;

			if (typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}
			
			if ('metadata' in attrs) {
				val = attrs['metadata'];
				if(!('metadata_json' in this.attributes)) {
					this.attributes['metadata_json'] = new Metadata();
					//this.attributes['metadata_json'].on('change', function() { this.trigger('update change change:metadata', this) }, this);
					//this.listenTo(this.attributes['metadata_json'], 'change', function() { this.trigger('change change:metadata')});
				}
				// If we have a JSON object, update our cache and dump the YAML to the metadata var:
				//this.attributes['metadata_json'].updateMetadata(val);
				this.attributes['metadata_json'].updateMetadata(val);
				this.attributes['metadata'] = this.attributes['metadata_json'].toYaml();
				// Don't continue with saving the metadata:
				delete attrs['metadata'];
				this.trigger('change change:metadata');
			}

			// Continue with Backbone default set behavior:
			Backbone.Model.prototype.set.call(this, attrs, options);
		},
		save: function(attrs, options) {
				options || (options = {});
				attrs || (attrs = _.clone(this.attributes));

				// Remove our JSON object cache:
				delete attrs.metadata_json;

				options.data = JSON.stringify(attrs);

				// Proxy the call to the original save function
				return Backbone.Model.prototype.save.apply(this, attrs, options);
		},
		initialize: function() {
		}
	});
	
	return Document;
}));