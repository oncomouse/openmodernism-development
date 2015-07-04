class App < Sinatra::Base
	before do
		content_type 'application/json'
	end
	#rest_create '/anthology' do
	#	Anthology.new
	#end
	
	get '/anthology' do
		params = CGI::parse(request.query_string)
		Anthology.all.to_json
	end
	
	post '/anthology' do
		body = JSON.parse request.body.read
		anthology = Anthology.create(
			:title => body['title'],
			:toc => body['toc']
		)
		status 201
		anthology.to_json
	end
	
	get '/anthology/:id' do
		anthology ||= Anthology.get(params[:id]) || halt(404)
		anthology.to_json
	end
	
	put '/anthology/:id' do
		body = JSON.parse request.body.read
		anthology ||= Anthology.get(params[:id]) || halt(404)
		halt 500 unless anthology.update(
			:title => body['title'],
			:toc => body['toc']
		)
		anthology.to_json
	end
	
	delete '/anthology/:id' do
		anthology ||= Anthology.get(params[:id]) || halt(404)
		halt 500 unless anthology.destroy
	end
end