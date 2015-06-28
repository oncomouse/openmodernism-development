class App < Sinatra::Base
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
	
	register Sinatra::AssetPack
	assets do
		if :development
			asset_dir = "assets"
		else
			asset_dir = "assets-build"
		end
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
		if :development
			js :app, [
				# Required libraries for Backbone & Bootsrap
				'/vendor/jquery/dist/jquery.js',
				'/vendor/lodash/lodash.js',
				# Backbone components:
				'/vendor/backbone/backbone.js',
				'/vendor/backbone.localstorage/backbone.localStorage.js',
				#'/vendor/backbone.paginator/lib/backbone.paginator.js',
				# Formatters and utility libraries:
				'/vendor/js-yaml/dist/js-yaml.js',
				'/vendor/sprintf/src/sprintf.js',
				'/javascripts/vendor/citeproc-amd/xmldom.js',
				'/javascripts/vendor/citeproc-amd/citeproc.js',
				'/javascripts/vendor/citeproc-amd/csl.js',
				'/javascripts/vendor/citeproc-amd/locale.js',
				'/javascripts/vendor/citeproc-amd/sys.js',
				'/javascripts/vendor/writedown/writedown.js',
				'/vendor/loremjs/lorem.js',
				# Only include the Bootstrap components we need:
				'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/button.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js',
				#'/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js',
				# Only include the Jquery UI components we need:
				#'/vendor/jquery-ui/ui/core.js',
				#'/vendor/jquery-ui/ui/widget.js',
				#'/vendor/jquery-ui/ui/mouse.js',
				#'/vendor/jquery-ui/ui/accordion.js',
				#'/vendor/jquery-ui/ui/autocomplete.js',
				#'/vendor/jquery-ui/ui/button.js',
				#'/vendor/jquery-ui/ui/datepicker.js',
				#'/vendor/jquery-ui/ui/dialog.js',
				#'/vendor/jquery-ui/ui/draggable.js',
				#'/vendor/jquery-ui/ui/droppable.js',
				'/vendor/jquery-ui/ui/effect.js',
				'/vendor/jquery-ui/ui/effect-blind.js',
				#'/vendor/jquery-ui/ui/effect-bounce.js',
				#'/vendor/jquery-ui/ui/effect-clip.js',
				#'/vendor/jquery-ui/ui/effect-drop.js',
				#'/vendor/jquery-ui/ui/effect-explode.js',
				#'/vendor/jquery-ui/ui/effect-fade.js',
				#'/vendor/jquery-ui/ui/effect-fold.js',
				#'/vendor/jquery-ui/ui/effect-highlight.js',
				#'/vendor/jquery-ui/ui/effect-puff.js',
				#'/vendor/jquery-ui/ui/effect-pulsate.js',
				#'/vendor/jquery-ui/ui/effect-scale.js',
				#'/vendor/jquery-ui/ui/effect-shake.js',
				#'/vendor/jquery-ui/ui/effect-size.js',
				#'/vendor/jquery-ui/ui/effect-slide.js',
				#'/vendor/jquery-ui/ui/effect-transfer.js',
				#'/vendor/jquery-ui/ui/menu.js',
				#'/vendor/jquery-ui/ui/position.js',
				#'/vendor/jquery-ui/ui/progressbar.js',
				#'/vendor/jquery-ui/ui/resizable.js',
				#'/vendor/jquery-ui/ui/selectable.js',
				#'/vendor/jquery-ui/ui/selectmenu.js',
				#'/vendor/jquery-ui/ui/slider.js',
				#'/vendor/jquery-ui/ui/sortable.js',
				#'/vendor/jquery-ui/ui/spinner.js',
				#'/vendor/jquery-ui/ui/tabs.js',
				#'/vendor/jquery-ui/ui/tooltip.js',
				# Backbone modules:
				'/javascripts/models/metadata/object.js',
				'/javascripts/models/metadata/author.js',
				'/javascripts/models/metadata/citation.js',
				'/javascripts/models/metadata/title.js',
				'/javascripts/models/metadata.js',
				'/javascripts/models/document.js',
				'/javascripts/models/document_file.js',
				'/javascripts/collections/document_collection.js',
				#'/javascripts/collections/metadata_collection.js',
				'/javascripts/views/document/document_view.js',
				'/javascripts/views/document/documents_view.js',
				'/javascripts/views/document/document_short_view.js',
				'/javascripts/views/document_file/document_file_view.js',
				'/javascripts/views/sidebar_view.js',
				'/javascripts/routes/document.js',
				'/javascripts/routes/documents.js',
				'/javascripts/app.js',
				'/javascripts/site.js'
			]
			
			js :require, [
				'/vendor/jquery/dist/jquery.js',
				'/vendor/requirejs/require.js',
				'/javascripts/main.js'
			]
		else
			js :require, [
				'/vendor/jquery/dist/jquery.js',
				'/vendor/requirejs/require.js',
				'/javascripts/main.js'
			]
		end
		


		js_compression :jsmin
	end
end