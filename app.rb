require 'json'
require 'cgi'

require 'sinatra/base'
require 'sinatra/head'

require 'data_mapper'
require 'dm-migrations'
require 'dm-types'

require 'haml'

class App < Sinatra::Base
	configure :development do
		DataMapper::Logger.new($stdout, :debug)
		DataMapper.setup(
			:default,
			'sqlite:db/development.sqlite'
		)
	end

	configure :production do
		DataMapper.setup(
			:default,
			'sqlite:db/production.sqlite'
		)
	end
	
	configure do
		Rack::Mime.mime_type('.tpl', 'text/plain')
		mime_type :tpl, 'text/html'
	end
	
	register Sinatra::Head

	#register Sinatra::RestAPI
	
	set :haml, :format => :html5
	
	run! if app_file == $0
end

# Load all our application modules out of the application directory:
Dir["./application/**/*.rb"].each do |module_name|
	require module_name
end

DataMapper.finalize.auto_upgrade!