(function (factory) {

	// CommonJS
	if (typeof exports == 'object') {
		module.exports = factory();
	}
	// AMD
	else if (typeof define == 'function' && define.amd) {
		define(['citeproc/locale'], factory);
	}
	// Browser
	else {
		window.Sys = factory();
	}

}(function (locale) {
	var Sys = function(abbreviations, bibdata){
		this.abbreviations = abbreviations || {};
		this.abbrevsname = "default";
		this.bibdata = bibdata || {};
	};

	Sys.prototype.retrieveItem = function(id){
		return this.bibdata[id];
	};

	Sys.prototype.retrieveLocale = function(lang){
		return locale[lang];
	};

	Sys.prototype.getAbbreviation = function(dummy, obj, jurisdiction, vartype, key){
	    try {
	    if (this.abbreviations[this.abbrevsname][vartype][key]) {
	        obj["default"][vartype][key] = this.abbreviations[this.abbrevsname][vartype][key];
	    } else {
	        obj["default"][vartype][key] = "";
	    }
	    } catch (e) {
	        // There is breakage here that needs investigating.
	    }
	};

	Sys.prototype.setAbbreviations = function (abbrevsname) {
		this.abbrevsname = abbrevsname;
	}
	return Sys;
}));
