class Author
	include DataMapper::Resource

	property :id, Serial
	property :given, String, :required => true
	property :given_use, String
	property :family, String, :required => true
	property :birth, Date
	property :death, Date
	
	has n, :documents, :through => Resource
end