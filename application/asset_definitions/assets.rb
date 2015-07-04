class App < Sinatra::Base
	if :development
		require 'sinatra/backbone'
		require 'sinatra/support'
		
		register Sinatra::JstPages
		serve_jst '/javascripts/jst.js'
		
		register Sinatra::CompassSupport
		set :scss, Compass.sass_engine_options.merge({ :load_paths => [ "#{App.root}/assets/stylesheets/", "#{App.root}/assets/vendor/", "#{App.root}/public/vendor/" ] })
	
		Compass.configuration do |config|
			config.sass_dir         = "assets/stylesheets"
			config.project_path     = root
			config.images_dir       = "assets/images"
			config.http_generated_images_path = "/images"
			config.fonts_dir = "assets/fonts"
			config.line_comments = true
		end
		
		require 'sinatra/assetpack'
		register Sinatra::AssetPack
		assets do
		
			asset_dir = "assets"
			serve '/javascripts', from: "#{asset_dir}/javascripts"
			serve '/stylesheets', from: "#{asset_dir}/stylesheets"
			serve '/vendor', from: "#{asset_dir}/vendor"
		
			css :app, [
				'/stylesheets/app.css'
			]
		
			js :polyfill, [
				'/vendor/respond/dest/respond.min.js',
				'/vendor/css3-mediaqueries-js/css3-mediaqueries.js',
				'/vendor/html5shiv/dist/html5shiv.js'
			]

			js :app,  Dir.glob('assets/**/*.js').map{|x| x.sub(/^assets/,'')}
		
			js :require, [
				'/vendor/jquery/dist/jquery.js',
				'/vendor/requirejs/require.js',
				'/javascripts/main.js'
			]

			js_compression :jsmin
		end
	end
end