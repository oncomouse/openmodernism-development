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
	else if (typeof _ !== 'undefined' && typeof Backbone !== 'undefined') {
		window.DocumentFile = factory(Backbone);
	}

}(function (Backbone) {
	var DocumentFile = Backbone.Model.extend({
		defaults: {
			contents: '',
			html: '',
			type: 'md',
			file_path: '',
			url: '',
			ocr: false,
			source_scan: false,
		}
	});
	return DocumentFile;
}));