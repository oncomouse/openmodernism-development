# Rakefile
APP_FILE  = 'app.rb'
APP_CLASS = 'App'

# Deployment

DEPLOYMENT = {
	:directory => "/home/eschaton/www/openmodernism.pilsch.com/current",
	:server => "copland.dreamhost.com",
	:user => "eschaton"
}

#require 'sinatra/assetpack/rake'
require 'dm-migrations'

require 'fileutils'

# List of files to skip:
EXCLUDES = [
	/^assets\//, # Don't upload uncompiled assets
  /node_modules/, # NEVER
	/^public\/vendor\/(?!requirejs)/, # Skip all vendor modules except require itself
	/javascripts\/(components|mixins|vendor|models|collections|views|utilities|jst.js|site.js|app.js|dispatcher.js|router.js)/, # Skip all written JavaScript except the routes/
	/[A-Z][a-z]+file/, # Don't need Rakefile or Gemfile (or a Capfile, if it exists)
	/application\/asset_definitions/, # Don't need any of the asset-pack stuff (which doesn't work on Dreamhost, anyway)
	/compass\.config\.rb/, # Don't upload build files
	/app\.build\.js/, # Don't upload build files
	/README\.md/,
	/build\.txt/,
	/bower.json/,
	/jsx_support.rb/,
	/\.jst\.tpl/, # We don't need to pass in the .jst.tpl files, as they are already built by JST.js
	/development\.sqlite/, # Don't upload the development DB file
	/ui\/(i18n|minified)/ # We don't need this anymore, but they match for jquery-ui files
]


desc "auto migrates the database"
task :migrate do
  require "./#{APP_FILE}"
  DataMapper.auto_migrate!
end

desc "auto upgrades the database"
task :upgrade do
  require "./#{APP_FILE}"
  DataMapper.auto_upgrade! 
end

task :deploy => "assets:pack" do
	require 'sshkit'
	require 'sshkit/dsl'
	
	puts "Running task :deploy"
	
	directories_made = [] # Cachce directories we create on the server
	
	# Use SSHKit to connect to the server:
	on "#{DEPLOYMENT[:user]}@#{DEPLOYMENT[:server]}" do
		within DEPLOYMENT[:directory] do
			# Upload the files:
			Dir.glob('**/*.*').each do |file|
				next if EXCLUDES.collect{|x| !x.match(file).nil? }.include? true # Exclude any files that match the exclusions
				if not directories_made.include? File.dirname(file) # If we haven't made it, build the remote directory:
					execute :mkdir, '-p', File.dirname(file) if File.dirname(file) != '.'
					directories_made << File.dirname(file)
				end
				upload! file, "#{DEPLOYMENT[:directory]}/#{File.dirname(file)}"
			end
			# Tell Phusion Passenger it needs to restart:
			execute :mkdir, '-p tmp'
			execute :touch, 'tmp/restart.txt'
		end
	end
	# Keep the development server free of compiled resources:
	FileUtils.rm_r Dir.glob("public/*")
end

namespace :assets do
	task :pack => ["assets:make_app_build_js", "assets:clean_copy", "assets:build_jst", "assets:compile_react", "assets:generate_polyfill",  "assets:run_r_js", "assets:uglify", "assets:compile_css", "assets:clean_public", "assets:copy_requirejs"] #
	
	# Run r.js on the clean copy of our assets directory:
	task :run_r_js do
		puts "Running task assets:run_r_js"
		system("node assets/vendor/r.js/dist/r.js -o app.build.js appDir=assets-clean_copy dir=public mainConfigFile=assets-clean_copy/javascripts/main.js")
		FileUtils.rm_r "assets-clean_copy"
		FileUtils.rm "app.build.js"
	end
	
	task :clean_public do
		puts "Running assets:clean_public"
		Dir.glob('public/**/*').each do |file|
			next if not EXCLUDES.collect{|x| !x.match(file).nil? }.include? true # Skip the good files.
			File.delete(file) if not File.directory? file
		end
		
		Dir.glob("public/**/*").select{ |d| File.directory? d}.sort{ |a,b| b.count('/') <=> a.count('/') }.each{ |d| Dir.rmdir(d) if (Dir.entries(d) - %w[.. .]).empty?}
	end
	
	task :copy_requirejs do
		require 'uglifier'
		FileUtils.mkdir_p "public/vendor/requirejs"
		#FileUtils.cp "assets/vendor/requirejs/require.js", "public/vendor/requirejs"
		
		puts "Running assets:copy_requirejs"
		compressed_source = Uglifier.compile(File.read("assets/vendor/requirejs/require.js"))
		File.open("public/vendor/requirejs/require.js", "w") do |fp|
			fp.write compressed_source.gsub(/\/\*.*?\*\//m,"")
		end
	end
	
	task :make_app_build_js do
		require 'json'
		config = JSON.parse(File.read('assets/javascripts/main.js').gsub(/(\t|\n)/,'').split('var requirejs_configuration = ')[1].split(';')[0].gsub('JAVASCRIPT_DIR', "'javascripts'").gsub("'",'"'))
		config['modules'] = [
			{
				'name' => 'main'
			}
		]
		Dir.glob("assets/javascripts/routes/**/*.js").each do |route_file|
			route_file.gsub!("assets/javascripts/","").gsub!(/\.js$/,"")
			module_json = {
				'name' => route_file,
				'exclude' => ['main']
			}
			if File.exist? "assets/react/components/sidebar/" + route_file + ".js"
				module_json["include"] = [ "components/sidebar/" + route_file ]
			end
			config['modules'].push(module_json)
		end
		config['appDir'] = './assets'
		config['dir'] = './public'
		config['skipDirOptimize'] = true
		config['optimize'] = 'none'
		File.open('app.build.js', 'w') do |json_fp|
			json_fp.write(JSON.pretty_generate(config))#.gsub(/^\{/,""))
		end
	end
	
	task :compile_react do
		require 'babel/transpiler'
		puts "Running task assets:compile_react"
		Dir.glob('assets/react/**/*.js').each do |react_file|
			new_file = react_file.gsub('assets/react/', 'assets-clean_copy/javascripts/')
			puts new_file
			if not File.exists? File.dirname(new_file)
				FileUtils.mkdir_p "#{File.dirname(new_file)}"
			end
			File.open(new_file, 'w') do |fp|
				fp.write Babel::Transpiler.transform(File.read(react_file))['code'].gsub(/\\n/,"\n").gsub(/\\t/,"\t")
			end
		end
		#system("node node node_modules/babel/bin/babel.js assets/react/components/ --out-dir assets-clean_copy/javascripts/components/")
	end
	
	task :uglify do
		require 'uglifier'
		
		puts "Running task assets:uglify"
		
		Dir.glob('public/**/*.js').each do |file|
			next if EXCLUDES.collect{|x| !x.match(file).nil? }.include? true # Exclude any files that match the exclusions
			puts "Uglifying #{file}"
			compressed_source = Uglifier.compile(File.read(file))
			File.open(file, 'w') do |f_pointer|
				f_pointer.write(compressed_source) #.gsub(/\/\*.*?\*\//m,"")
			end
		end
	end
	
	task :generate_polyfill do
		puts "Running task assets:generate_polyfill"
		polyfill = [
			'/vendor/respond/dest/respond.src.js',
			'/vendor/css3-mediaqueries-js/css3-mediaqueries.js',
			'/vendor/html5shiv/dist/html5shiv.js'
		]
		FileUtils.mkdir_p "assets-clean_copy/javascripts"
		File.open('assets-clean_copy/javascripts/polyfill.js', 'w') do |poly_fp|
			polyfill.each do |p|
				poly_fp.write(IO.read "assets/#{p}")
			end
		end
	end
	
	# Create a copy of the assets directory that only uses the vendor packages we are actually deploying and the JS files we need:
	task :clean_copy do
		require 'json'
		
		puts "Running task assets:clean_copy"
		
		# Create our copy:
		FileUtils.mkdir_p('assets-clean_copy/vendor/')
		
		# Read in the r.js build script:
		requirejs_config = JSON.parse(IO.read('app.build.js').gsub(/^\(/,"").gsub(/\)$/,"").gsub(/\'/,"\""))
		
		# Grab all the vendor files from the require.js configuration:
		required_files = requirejs_config['paths'].values.select{ |i| i =~ /^\.\.\// }
		
		# Parse the assets/vendor directory:
		Dir.glob("assets/vendor/**/*").each do |file|
			file.sub!(/^assets\//,"")
			
			# If file is not a JavaScript file or a directory, skip it:
			next if not file =~ /\.js$/ and not Dir.exists? "assets/#{file}"
			
			file.sub!(/\.js$/, "")
			# Do we need the file?
			if required_files.include?("../" + file)
				# If it's a JS file, copy it:
				if File.exists? "assets/#{file}.js"
					FileUtils.mkdir_p "assets-clean_copy/vendor/#{File.dirname("#{file}.js").sub(/^vendor\//,"")}"
					FileUtils.cp "#{"assets/#{file}.js"}", "assets-clean_copy/vendor/#{File.dirname("#{file}.js").sub(/^vendor\//,"")}"
				end
				# If it's a directory, copy it's contents:
				if Dir.exists? "assets/#{file}"
					FileUtils.mkdir_p "assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}"
					FileUtils.cp_r Dir.glob("#{"assets/#{file}"}/*"), "assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}"
				end
			end
		end
		
		# Copy over the javascripts directory:
		FileUtils.cp_r "assets/javascripts", "assets-clean_copy/"
	end
	task :build_jst do 
		puts "Running task assets:build_jst"
		File.open("assets-clean_copy/javascripts/jst.js", "w") do |jst|
			jst.write("define(['underscore'], function(_){var c = {}; var JST = {};")
			Dir.glob("views/**/*.jst.*").each do |template|
				content = IO.read(template)
				content.gsub!("\n", "\\n")
				content.gsub!(/\"/,"\\\"")
				template.sub!(/^views\//,"").sub!(/\.jst\.[a-z]+/,"")
				jst.write("JST['#{template}'] = function() { if (!c['#{template}']) c['#{template}'] = (_.template(\"#{content}\")); return c['#{template}'].apply(this, arguments); };")
			end
			jst.write("return JST });")
		end
	end
	task :compile_css do
		require 'compass'
		require 'compass/sass_compiler'
		puts "Running task assets:compile_css"
		compiled_css =  Dir.glob('assets/stylesheets/**/[^_]*.scss').map{ |x| File.basename(x).gsub(/\.(?:scss|sass)/,'.css') }
		FileUtils.mkdir_p "public/stylesheets"
		compiled_css.each{ |file| File.unlink("public/stylesheets/#{file}") if File.exists? file }
		puts "Running Compass:"
		Compass.add_configuration({
			:http_path => "/",
			:additional_import_paths => ["assets/vendor/"],
			:css_dir => "public/stylesheets",
			:sass_dir => "assets/stylesheets",
			:output_style => :compressed,
			:line_comments => false
			
		}, "compass")
		Compass.sass_compiler.compile!
	end
end