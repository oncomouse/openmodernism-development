# Rakefile
APP_FILE  = 'app.rb'
APP_CLASS = 'App'

#require 'sinatra/assetpack/rake'
require 'dm-migrations'

# List of files to skip:
EXCLUDES = [
	/^assets\//, # Don't upload uncompiled assets
	/^public\/vendor\/(?!require)/, # Skip all vendor modules except require itself
	/javascripts\/(vendor|models|collections|views|utilities|jst.js|site.js|app.js)/, # Skip all written JavaScript except the routes/
	/[A-Z][a-z]+file/, # Don't need Rakefile or Gemfile (or a Capfile, if it exists)
	/application\/asset_definitions/, # Don't need any of the asset-pack stuff (which doesn't work on Dreamhost, anyway)
	/compass\.config\.rb/, # Don't upload build files
	/app\.build\.js/, # Don't upload build files
	/README\.md/,
	/build\.txt/,
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
	on 'eschaton@copland.dreamhost.com' do
		within "/home/eschaton/www/openmodernism.pilsch.com/current" do
			# Upload the files:
			Dir.glob('**/*.*').each do |file|
				next if EXCLUDES.collect{|x| !x.match(file).nil? }.include? true # Exclude any files that match the exclusions
				if not directories_made.include? File.dirname(file) # If we haven't made it, build the remote directory:
					execute :mkdir, '-p', File.dirname(file) if File.dirname(file) != '.'
					directories_made << File.dirname(file)
				end
				upload! file, "/home/eschaton/www/openmodernism.pilsch.com/current/#{File.dirname(file)}"
			end
			# Tell Phusion Passenger it needs to restart:
			execute :mkdir, '-p tmp'
			execute :touch, 'tmp/restart.txt'
		end
	end
	# Keep the development server free of compiled resources:
	system("rm -r public/*")
end

namespace :assets do
	task :pack => ["assets:clean_copy", "assets:build_jst", "assets:run_r_js", "assets:uglify", "assets:compile_css"] #
	
	# Run r.js on the clean copy of our assets directory:
	task :run_r_js do
		puts "Running task assets:run_r_js"
		system("node assets/vendor/r.js/dist/r.js -o app.build.js appDir=assets-clean_copy mainConfigFile=assets-clean_copy/javascripts/main.js")
		#system("java -classpath /Users/andrew/Downloads/js.jar:/Users/andrew/Desktop/Software/goog/closure-compiler/build/compiler.jar org.mozilla.javascript.tools.shell.Main assets/vendor/r.js/dist/r.js -o app.build.js appDir=assets-clean_copy mainConfigFile=assets-clean_copy/javascripts/main.js")
		system ('rm -r assets-clean_copy')
	end
	
	task :uglify do
		require 'uglifier'
		
		puts "Running task assets:uglify"
		
		Dir.glob('public/**/*.js').each do |file|
			next if EXCLUDES.collect{|x| !x.match(file).nil? }.include? true # Exclude any files that match the exclusions
			puts "Uglifying #{file}"
			compressed_source = Uglifier.compile(File.read(file))
			File.open(file, 'w') do |f_pointer|
				f_pointer.write(compressed_source)
			end
		end
	end
	
	# Create a copy of the assets directory that only uses the vendor packages we are actually deploying and the JS files we need:
	task :clean_copy do
		require 'json'
		
		puts "Running task assets:clean_copy"
		
		# Create our copy:
		Dir.mkdir('assets-clean_copy') if not Dir.exists? 'assets-clean_copy'
		Dir.mkdir('assets-clean_copy/vendor/') if not Dir.exists? 'assets-clean_copy/vendor'
		
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
					system("mkdir -p assets-clean_copy/vendor/#{File.dirname("#{file}.js").sub(/^vendor\//,"")}")
					system("cp #{"assets/#{file}.js"} assets-clean_copy/vendor/#{File.dirname("#{file}.js").sub(/^vendor\//,"")}")
				end
				# If it's a directory, copy it's contents:
				if Dir.exists? "assets/#{file}"
					system("mkdir -p assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}")
					system("cp -r #{"assets/#{file}"}/* assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}")
				end
			end
		end
		
		# Copy over the javascripts directory:
		system("cp -r assets/javascripts assets-clean_copy/")
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
		puts "Running task assets:compile_css"
		compiled_css =  Dir.glob('assets/stylesheets/**/[^_]*.scss').map{ |x| File.basename(x).gsub(/\.(?:scss|sass)/,'.css') }
		system("mkdir -p public/stylesheets")
		compiled_css.each{ |file| File.unlink("public/stylesheets/#{file}") if File.exists? file }
		puts "Running Compass:"
		system("bundle exec compass compile -c compass.config.rb")
	end
end