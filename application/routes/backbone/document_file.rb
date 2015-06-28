class App < Sinatra::Base
	get '/document/:id/file.?:format?' do
		halt(404) unless (params['format'] == 'md' or params['format'] == 'markdown' or params['format'] == 'pdf' or params['format'] == nil)
		content_type params['format'] == 'pdf' ? 'application/pdf' : 'plain/text'
		
		# Set url based on file_type for PDFs
		
		# Convert markdown into HTML for MD
		
		"Document: #{params['id']}, Format: #{params['format'] ? params['format'] : "default"}"
	end
end