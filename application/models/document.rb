class Document
	include DataMapper::Resource
	property :id, Serial
	property :metadata, Text, :lazy => false
	
	has n, :citations
	has n, :authors, :through => Resource
	has n, :document_files
end