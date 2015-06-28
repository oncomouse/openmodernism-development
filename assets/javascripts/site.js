var DEBUG = false;
//(function(jQuery,_,Backbone){			
	var Router = Backbone.Router.extend({
		routes: {
			'': 'documents', // SET THIS TO THE DEFAULT ROUTE
			'documents': 'documents',
			'document/:id': 'document'
		},
		routeReady: function() {
			var s = $('.sidebar');
			if (s.length > 0) {
				s.affix({
					offset: {
						top: s.position().top,
						bottom: 0
					}
				});
			}
		},
		// Initialization code to run every time a route is rendered (similar to $(document).ready on a normal web page):
		initialize: function() {
			this.on('ready', function() {
				this.routeReady();
			});
		}
	});
	
	var app = {};
	
	app.clearAppCanvas = function() {
		$('#app').html('');
	}
	
	app.documentsRoute = function() {		
		var new_document_list = false;
		
		app.clearAppCanvas();
		
		if(!('documentList' in app)) {
			new_document_list = true;
			app.documentList = new DocumentCollection();
		}
		if(!('documentsView' in app)) {
			app.documentsView = new DocumentsView();
		}
		if(new_document_list) {
			app.documentList.fetch().then(function() { 
				app.documentList.trigger('reset');
				app.router.trigger('ready');
			});
		} else {
			app.documentList.trigger('reset');
			app.router.trigger('ready');
		}
	}
	
	app.documentRoute = function(id) {
		var currentDocument = {};
		
		app.clearAppCanvas();
		
		// Detect if it is possible to extract the document from a preexisting documentList instance:
		if (typeof app.documentList !== 'undefined') {
			currentDocument = app.documentList.get(parseInt(id));
			app.currentDocumentView = new DocumentView(currentDocument);
			app.currentDocumentView.render();
			app.router.trigger('ready');
		} else {
			currentDocument = new Document({'id': id});
			currentDocument.fetch().then(function() {
				app.currentDocumentView = new DocumentView(currentDocument);
				app.currentDocumentView.render();
				app.router.trigger('ready');
			});
		}

	}
	
	app.genericRoute = function(params) {
		app.clearAppCanvas();
		
		app.router.trigger('ready');
	}
	

	
	$(document).ready(function() {
		// Generate the router:
		app.router = new Router;
		
		// Hook up the sidebar:
		app.sidebar = new SidebarView;
		app.router.on('route', function(route,params) {
			app.sidebar.changeRoute(route);
		});
		app.router.on('ready', function() {
			app.sidebar.render();
		});
		// Hook up our controllers:
		app.router.on('route:documents', app.documentsRoute);
		app.router.on('route:document', app.documentRoute);
		
		if (DEBUG) {
			app.router.on('route', function(route, params) {
				console.log('Different Page: ' + route);
			});
			Backbone.Model.prototype.trigger = function() {
				console.log('Event', arguments);
				Backbone.Events.trigger.apply(this, arguments);
			}
		}
		
		Backbone.history.start();

	});
	
//})(jQuery,_,Backbone);