class Citation
	include DataMapper::Resource
	
	property :id, Serial
	property :container_title, String
	property :date, Date
	property :volume, String
	property :issue, String
	property :publisher, String
	property :publisher_place, String
	property :page, String
	
	belongs_to :document
end