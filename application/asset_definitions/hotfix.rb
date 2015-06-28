require 'rack/test'

module Sinatra
	module AssetPack
		# Returns a map of what MIME format each Tilt type returns.
		def self.tilt_formats
			@formats ||= begin
				hash = Hash.new
				Tilt.mappings.each do |format, (engine, _)|
					# @todo Remove when fix is merged in tilt
					# https://github.com/rtomayko/tilt/pull/206
					next if engine.nil? 
					case engine.default_mime_type
					when 'text/css' then hash[format] = 'css'
					when 'application/javascript' then hash[format] = 'js'
					end
				end

				hash
			end
		end
	end
end
