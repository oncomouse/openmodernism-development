class DocumentFile
	include DataMapper::Resource
	
	property :id, Serial
	property :contents, Text
	property :type, Enum[:markdown, :pdf, :md], :default => :md
	property :file_path, String
	property :ocr, Boolean
	property :source_scan, Boolean
	
	belongs_to :document
end