# Rakefile
APP_FILE  = 'app.rb'
APP_CLASS = 'App'

#require 'sinatra/assetpack/rake'
require 'dm-migrations'

require 'json'

require 'sshkit'
require 'sshkit/dsl'

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
	puts "Running task :deploy"
	
	excludes = [
		/^assets\//,
		/[A-Z][a-z]+file/,
		/application\/asset_definitions/,
		/compass\.config\.rb/,
		/app\.build\.js/,
		/ui\/i18n/,
		/ui\/minified/
	]
	on 'eschaton@copland.dreamhost.com' do
		within "/home/eschaton/www/openmodernism.pilsch.com/current" do
			Dir.glob('**/*.*').each do |file|
				next if excludes.collect{|x| !x.match(file).nil? }.include? true
				execute :mkdir, '-p', File.dirname(file) if File.dirname(file) != '.'
				upload! file, "/home/eschaton/www/openmodernism.pilsch.com/current/#{File.dirname(file)}"
			end
			# Tell Phusion Passenger it needs to restart:
			execute :touch, 'tmp/restart.txt'
		end
	end
	# Keep the development server free of compiled resources:
	system("rm -r public/*")
end

namespace :assets do
	task :pack => ["assets:clean_copy", "assets:build_jst", "assets:run_r_js", "assets:compile_css"]
	
	task :run_r_js do
		puts "Running task assets:run_r_js"
		system("node assets/vendor/r.js/dist/r.js -o app.build.js appDir=assets-clean_copy mainConfigFile=assets-clean_copy/javascripts/main.js")
		system ('rm -r assets-clean_copy')
	end
	
	task :clean_copy do
		puts "Running task assets:clean_copy"
		Dir.mkdir('assets-clean_copy') if not Dir.exists? 'assets-clean_copy'
		Dir.mkdir('assets-clean_copy/vendor/') if not Dir.exists? 'assets-clean_copy/vendor'
		
		requirejs_config = JSON.parse(IO.read('app.build.js').gsub(/^\(/,"").gsub(/\)$/,"").gsub(/\'/,"\""))
		
		required_files = requirejs_config['paths'].values.select{ |i| i =~ /^\.\.\// }
		
		Dir.glob("assets/vendor/**/*").each do |file|
			file.sub!(/^assets\//,"")
			next if not file =~ /\.js$/ and not Dir.exists? "assets/#{file}"
			file.sub!(/\.js$/, "")
			if required_files.include?("../" + file)
				if File.exists? "assets/#{file}.js"
					system("mkdir -p assets-clean_copy/vendor/#{File.dirname("#{file}.js").sub(/^vendor\//,"")}")
					system("cp #{"assets/#{file}.js"} assets-clean_copy/vendor/#{File.dirname("#{file}.js").sub(/^vendor\//,"")}")
				end
				if Dir.exists? "assets/#{file}"
					system("mkdir -p assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}")
					system("cp -r #{"assets/#{file}"}/* assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}")
				end
			end
		end
		
		system("cp -r assets/javascripts assets-clean_copy/")
	end
	task :build_jst do 
		puts "Running task assets:build_jst"
		File.open("assets-clean_copy/javascripts/jst.js", "w") do |jst|
			jst.write("(function(){var c = {};if (!window.JST) window.JST = {};")
			Dir.glob("views/**/*.jst.*").each do |template|
				content = IO.read(template)
				content.gsub!("\n", "\\n")
				content.gsub!(/\"/,"\\\"")
				template.sub!(/^views\//,"").sub!(/\.jst\.[a-z]+/,"")
				jst.write("JST['#{template}'] = function() { if (!c['#{template}']) c['#{template}'] = (_.template(\"#{content}\")); return c['#{template}'].apply(this, arguments); };")
			end
			jst.write("})();")
		end
	end
	task :compile_css do
		puts "Running task assets:compile_css"
		compiled_css = [
			'app.css'
		]
		system("mkdir -p public/stylesheets")
		compiled_css.each{ |file| File.unlink("public/stylesheets/#{file}") if File.exists? file }
		puts "Running Compass:"
		system("bundle exec compass compile -c compass.config.rb")
	end
end