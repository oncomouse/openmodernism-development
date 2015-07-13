'use strict';

(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory(require('underscore'), require('backbone'), require('citeproc'), require('citeproc/sys'));
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['underscore','backbone','citeproc/citeproc','citeproc/sys', 'citeproc/csl', 'writedown', 'models/metadata/object'], factory);
	}
	// Browser
	else if (typeof _ !== 'undefined' && typeof Backbone !== 'undefined' && typeof Writedown && typeof CSL !== 'undefined' && typeof Sys !== 'undefined' && typeof MetadataObject !== 'undefined') {
		window.MetadataCitation = factory(_,Backbone,CSL,Sys,citationstyles,Writedown,MetadataObject);
	}

}(function (_,Backbone,CSL,Sys,citationstyles, Writedown, MetadataObject) {
	var MetadataCitation = MetadataObject.extend({
		defaults: {
			original: {}
		},
		initialize: function(citation, author, title) {
			var citeproc, sys, output, citeproc_record;
			citation || (citation = this.defaults.citation);
			author || (author = '');
			title || (title = '');

			if(typeof citation === 'object' && citation instanceof Array) {
				citation = citation[0]; // Change this
			}
			
			this.attributes['original'] = citation;
			this.attributes['original']['author'] = author;
			this.attributes['original']['title'] = title;
			
			citeproc_record = _.clone(this.attributes['original'],true);
			
			citeproc_record['id'] = 'citation';
			
			if('year' in this.attributes['original']) {
				citeproc_record['issued'] = {};
				citeproc_record['issued']['year'] = this.attributes['original']['year'];
				if('month' in this.attributes['original']) {
					citeproc_record['issued']['month'] = this.attributes['original']['month'];
					if('day' in this.attributes['original']) {
						citeproc_record['issued']['day'] = this.attributes['original']['day'];
					}
				}
			} else if('date' in this.attributes['original']) {
				citeproc_record['issued'] = { 'date-parts': _.map(this.attributes['original']['date'].split('-'), function(e) { return parseInt(e); })};
			}
			
			citeproc_record['title'] = Writedown.html(citeproc_record['title']);
			
			if('pages' in this.attributes['original']) {
				citeproc_record['page'] = this.attributes['original']['pages'];
			}
			
			sys = new Sys({'default': {}}, {'citation': citeproc_record });
			citeproc = new CSL.Engine(sys, citationstyles['modern-language-association']);
			citeproc.setAbbreviations("default");
			citeproc.updateItems(['citation']);
			output = citeproc.makeBibliography();
			if (output && output.length && output[1].length){
				this.attributes['string'] = output[1].join("");//output[0].bibstart +	+ output[0].bibend;
			} else {
				this.attributes['string'] = "Error Processing Citation";
			}
		}
	});
	return MetadataCitation;
}));