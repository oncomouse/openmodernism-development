(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('underscore'), require('backbone'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['underscore','backbone','jsyaml'], factory);
	}
	// Browser
	else if (typeof _ !== 'undefined' && typeof Backbone !== 'undefined' && typeof jsyaml !== 'undefined') {
		window.Anthology = factory(_,Backbone,jsyaml);
	}

}(function (_,Backbone,jsyaml) {
	var Anthology = Backbone.Model.extend({
		urlRoot: '/anthology',
		idAttribute: 'id',
		defaults: {
			title: '',
			toc: '[]',
			documents: '[]'
		},
		set: function(key, val, options) {
			var self = this,
					attrs;
			if (key == null) return this;

			if (typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}
			if ('toc' in attrs) {
				if (typeof attrs['toc'] === 'String') {
					this.attributes['toc'] = jsyaml.safeLoad(attrs['toc']);
				} else {
					this.attributes['toc'] = attrs['toc'];
				}
				delete attrs['toc'];
				this.trigger('change change:toc');
			}
			
			return Backbone.Model.prototype.set.call(this, attrs, options);
		}
	});
	return Anthology;
}));