var JAVASCRIPT_DIR = '/javascripts';
var requirejs_configuration = {
	baseUrl: '/javascripts',

	paths: {
		'backbone': '../vendor/backbone/backbone',
		'bootstrap': '../vendor/bootstrap-sass-official/assets/javascripts/bootstrap',
		'citeproc': 'vendor/citeproc-amd',
		'jquery': '../vendor/jquery/dist/jquery',
		'jquery-ui': '../vendor/jquery-ui/ui',
		'jsyaml': '../vendor/js-yaml/dist/js-yaml',
		'lodash': '../vendor/lodash/lodash',
		'lorem': '../vendor/loremjs/lorem',
		'sprintf': 'vendor/sprintf-amd/sprintf-shim',
		'sprintf-vendor': '../vendor/sprintf/src/sprintf',
		'writedown': 'vendor/writedown/writedown'
	},
	shim: {
		'lodash': {
			exports: '_'
		},
		'jquery-ui': {
			deps: ['jquery'],
			exports: '$'
		},
		'jst': {
			exports: 'JST'
		},
		'lorem': {
			exports: 'Lorem'
		},
		'sprintf': {
			exports: 'sprintf'
		},
		'bootstrap/affix':      { deps: ['jquery'], exports: '$.fn.affix' }, 
		'bootstrap/alert':      { deps: ['jquery'], exports: '$.fn.alert' },
		'bootstrap/button':     { deps: ['jquery'], exports: '$.fn.button' },
		'bootstrap/carousel':   { deps: ['jquery'], exports: '$.fn.carousel' },
		'bootstrap/collapse':   { deps: ['jquery'], exports: '$.fn.collapse' },
		'bootstrap/dropdown':   { deps: ['jquery'], exports: '$.fn.dropdown' },
		'bootstrap/modal':      { deps: ['jquery'], exports: '$.fn.modal' },
		'bootstrap/popover':    { deps: ['jquery'], exports: '$.fn.popover' },
		'bootstrap/scrollspy':  { deps: ['jquery'], exports: '$.fn.scrollspy' },
		'bootstrap/tab':        { deps: ['jquery'], exports: '$.fn.tab'        },
		'bootstrap/tooltip':    { deps: ['jquery'], exports: '$.fn.tooltip' },
		'bootstrap/transition': { deps: ['jquery'], exports: '$.fn.transition' }
	},
	map: {
		'*': {
			'underscore': 'lodash'
		}
	}
};

(function(factory) {
	if (typeof window.development !== 'undefined') {
		// This has to do with the way sinatra/assetpack does cache busting and will only
		// run in development mode.
		// Basically, we process 
		jQuery.get('/jsstubs').always(function(data) {
			var script_dir_re = RegExp('^' + JAVASCRIPT_DIR + '/');
			var extra_paths = {};
			jQuery.each(data.responseText.split('\n'), function(i,script) {
				script = script.replace(/<script src=\'/,'').replace(/'><\/script>/,'').replace(/\.js$/,'');
				if(!script.match(script_dir_re) || script.contains('vendor')) {
					return;
				}
				script = script.replace(script_dir_re, '');
				script = script.split('.')
				var cache_key = script.slice(-1).join('');
				script = script.slice(0,-1).join('.')
				requirejs_configuration.paths[script] = script + '.' + cache_key;
			});
			factory(requirejs_configuration);
		});
	} else {
		factory(requirejs_configuration);
	}
}(function(require_config) {
	requirejs.config(require_config);

	require(['app'], function(App) { App.start(); });
}));