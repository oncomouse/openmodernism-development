require 'json'
require 'cgi'

require 'sinatra/base'
require 'sinatra/head'
require 'sinatra/flash'

require 'data_mapper'
require 'dm-migrations'
require 'dm-types'

require 'bcrypt'
require 'warden'

require 'haml'

#require 'omniauth'
#require 'omniauth-twitter'
#require 'omniauth-github'
#require 'omniauth-facebook'
#require 'omniauth-openid'
#require 'openid/store/filesystem'


class App < Sinatra::Base
	enable :sessions
	register Sinatra::Flash
	
	use Warden::Manager do |config|
		config.serialize_into_session{|user| user.id }
		config.serialize_from_session{|id| User.get(id) }
		config.scope_defaults :default,
			:strategies => [:password],
			:action => 'auth/unauthenticated'
		config.failure_app = self
	end
	
	Warden::Manager.before_failure do |env,opts|
		env['REQUEST_METHOD'] = 'POST'
	end
	
	Warden::Strategies.add(:password) do
		def valid?
			params['user']['username'] && params['user']['password']
		end

		def authenticate!
			user = User.first(:username => params['user']['username'])

			if user.nil?
				fail!("The username you entered does not exist.")
			elsif user.authenticate(params['user']['password'])
				success!(user)
			else
				fail!("Could not log in")
			end
		end
	end
	
	post '/auth/login' do
		env['warden'].authenticate!
		
		content_type 'application/json'
		
		"{status: #{env['warden'].message}#{if not env['warden'].user.nil? then ", user: #{env['warden'].user.to_json}" end}}"
	end
	
	get '/auth/logout' do
		env['warden'].raw_session.inspect
		env['warden'].logout
	end
	
	get '/authenticated' do
		env['warden'].authenticate!
		"{status: #{env['warden'].message}#{if not env['warden'].user.nil? then ", user: #{env['warden'].user.to_json}" end}}"
	end
	
		
	
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
	#require 'data_mapper'; require 'bcrypt'; DataMapper.setup(:default,'sqlite:db/development.sqlite'); Dir['./application/models/**/*.rb'].each { |m| require m }; DataMapper.finalize.auto_upgrade!
	#require 'data_mapper'; require 'bcrypt'; DataMapper.setup(:default,'sqlite:db/production.sqlite'); Dir['./application/models/**/*.rb'].each { |m| require m }; DataMapper.finalize.auto_upgrade!

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