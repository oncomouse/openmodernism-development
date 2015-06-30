if ENV['RACK_ENV'] == 'production'
	ENV['GEM_HOME'] = '/home/eschaton/.gems'
	ENV['GEM_PATH'] = '$GEM_HOME:/usr/lib/ruby/gems/1.8'
	require 'rubygems'
	Gem.clear_paths
	require 'sinatra'
	
	FileUtils.mkdir_p 'log' unless File.exists?('log')
	log = File.new("log/sinatra.log", "a")
	$stderr.reopen(log)
end

require './app'
run App