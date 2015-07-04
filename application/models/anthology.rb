class Anthology
	include DataMapper::Resource
	
	property :id, Serial
	property :title, String
	property :toc, Text # JSON Object
	
	belongs_to :user
	has n, :documents, :through => Resource
end