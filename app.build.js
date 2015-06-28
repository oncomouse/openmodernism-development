({
	'appDir': './assets',
	'baseUrl': 'javascripts',
	'dir': './public',
	'paths': {
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
	'map': {
		'*': {
			'underscore': 'lodash'
		}
	},

	'skipDirOptimize': false
})