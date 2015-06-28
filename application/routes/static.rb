class App < Sinatra::Base
	get "/" do
		content_type 'text/html'
		title << "Welcome to the Site"
		haml :index
	end
	if :development
		get "/jsstubs" do
			js(:app)
		end
	end
end