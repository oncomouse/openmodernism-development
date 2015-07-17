require 'babel/transpiler'

module Sinatra::JsxSupport
	def self.registered(app)
		app.set :js_max_age, app.development? ? 0 : 86400*30
	end
	def serve_jsx(url_prefix, options={})
		path = File.join(url_prefix, '*.js')
		prefix = options[:from]

		get path do |name|
			fname = Dir[File.join(prefix, "#{name}.{js}")].first	or pass

			content_type :js
			last_modified File.mtime(fname)
			cache_control :public, :must_revalidate, :max_age => settings.js_max_age

			Babel::Transpiler.transform File.read(fname)
		end
	end
end