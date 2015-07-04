require 'json'
require 'cgi'

require 'sinatra/base'
require 'sinatra/head'

require 'data_mapper'
require 'dm-migrations'
require 'dm-types'

require 'haml'

#require 'omniauth'
#require 'omniauth-twitter'
#require 'omniauth-github'
#require 'omniauth-facebook'
#require 'omniauth-openid'
#require 'openid/store/filesystem'


class App < Sinatra::Base
#	use Rack::Session::Cookie, secret: 'The world of Oath'
#	use OmniAuth::Builder do
#		provider :github, 'key', 'secret' #https://github.com/settings/applications
#		provider :twitter, ' key', 'secret' #https://dev.twitter.com/apps/new
#		provider :open_id, :store => OpenID::Store::Filesystem.new('/tmp')
#		provider :facebook, 'key', 'secret' #http://developers.facebook.com/docs/authentication
#	end
#	
#	post '/auth/:name/callback' do
#		auth = request.env['omniauth.auth']
#	end
#	
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