({
	'appDir': './assets',
	'baseUrl': 'javascripts',
	'dir': './public',
	'paths': {
		'require': '../vendor/requirejs/require',
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
	'shim': {
		'lodash': {
			'exports': '_'
		},
		'jquery-ui': {
			'deps': ['jquery'],
			'exports': '$'
		},
		'jst': {
			'exports': 'JST'
		},
		'lorem': {
			'exports': 'Lorem'
		},
		'sprintf': {
			'exports': 'sprintf'
		},
		'bootstrap/affix':      { 'deps': ['jquery'], 'exports': '$.fn.affix' }, 
		'bootstrap/alert':      { 'deps': ['jquery'], 'exports': '$.fn.alert' },
		'bootstrap/button':     { 'deps': ['jquery'], 'exports': '$.fn.button' },
		'bootstrap/carousel':   { 'deps': ['jquery'], 'exports': '$.fn.carousel' },
		'bootstrap/collapse':   { 'deps': ['jquery'], 'exports': '$.fn.collapse' },
		'bootstrap/dropdown':   { 'deps': ['jquery'], 'exports': '$.fn.dropdown' },
		'bootstrap/modal':      { 'deps': ['jquery'], 'exports': '$.fn.modal' },
		'bootstrap/popover':    { 'deps': ['jquery'], 'exports': '$.fn.popover' },
		'bootstrap/scrollspy':  { 'deps': ['jquery'], 'exports': '$.fn.scrollspy' },
		'bootstrap/tab':        { 'deps': ['jquery'], 'exports': '$.fn.tab'        },
		'bootstrap/tooltip':    { 'deps': ['jquery'], 'exports': '$.fn.tooltip' },
		'bootstrap/transition': { 'deps': ['jquery'], 'exports': '$.fn.transition' }
	},
	'map': {
		'*': {
			'underscore': 'lodash'
		}
	},
	'modules': [
		{
			'name': 'main'
		},
		{
			'name': 'routes/document',
			'exclude': ['main']
		},
		{
			'name': 'routes/documents',
			'exclude': ['main']
		}
	],
	'skipDirOptimize': false
})