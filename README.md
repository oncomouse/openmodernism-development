## Defining a route:

This app uses route files to handle interaction between the main app context (`app`) and the libraries that do not have access to the global context. These route files are compiled as modules when `r.js` runs at deployment, making them include all utilities needed to run that route.



### The `assets/javascripts/routes/route_name.js` File:

Here is a generic route file. Change the name of the library name and the `return` statement, then add your content:

```javascript
define([
	// Libraries go here:
], function(

) {
	var GenericRoute = function(app) {
		app.clearAppCanvas();
		
		// Your code goes here:
		
		app.router.trigger('ready router:ready');
	}
	return GenericRoute;
});
```

### Hooking up the route:

In the `assets/javascripts/app.js` file, find the `app.route` object and add the route. For the key, use the route or routes you want the Router to look for. For the value, use the name of the route file you made above.

### Setting up the build:

In the `app.build.js` file, you need to define a new module. In the `modules` array, add an entry like the following:

```javascript
		{
			'name': 'routes/generic',
			'exclude': ['main']
		}
```

The `'name'` value is the file path of the route file relative to the `assets/javascripts/` directory (leave off the `.js` extension).