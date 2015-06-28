# Rakefile
APP_FILE  = 'app.rb'
APP_CLASS = 'App'

#require 'sinatra/assetpack/rake'
require 'dm-migrations'

require 'json'

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

namespace :assets do
	task :pack => ["assets:clean_copy", "assets:build_jst"] do
		system("node assets/vendor/r.js/dist/r.js -o app.build.js appDir=assets-clean_copy mainConfigFile=assets-clean_copy/javascripts/main.js")
		system ('rm -r assets-clean_copy')
	end
	task :clean_copy do
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
					system("cp -r #{"assets/#{file}"} assets-clean_copy/vendor/#{file.sub(/^vendor\//,"")}")
				end
			end
		end
		
		system("cp -r assets/javascripts assets-clean_copy/")
	end
	task :build_jst do 
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
end