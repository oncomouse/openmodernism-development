class App < Sinatra::Base
	before do
		content_type 'application/json'
	end
	#rest_create '/document' do
	#	Document.new
	#end
	
	get '/document' do
		params = CGI::parse(request.query_string)
		Document.all.to_json
	end
	
	post '/document' do
		body = JSON.parse request.body.read
		document = Document.create(
			metadata: body['metadata']
		)
		status 201
		document.to_json
	end
	
	get '/document/:id' do
		document ||= Document.get(params[:id]) || halt(404)
		document.to_json
	end
	
	put '/document/:id' do
		body = JSON.parse request.body.read
		document ||= Document.get(params[:id]) || halt(404)
		halt 500 unless document.update(
			metadata: body['metadata']
		)
		document.to_json
	end
	
	delete '/document/:id' do
		document ||= Document.get(params[:id]) || halt(404)
		halt 500 unless document.destroy
	end
end