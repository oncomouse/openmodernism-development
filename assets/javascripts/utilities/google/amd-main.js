requirejs.config({
	paths: {
		'google-phonenumberutil': 'vendor/google/phonenumberutil.min'
	},
	shims: {
		'google-phonenumberutil': {
			exports: 'PhoneNumberUtil'
		},
	}
});