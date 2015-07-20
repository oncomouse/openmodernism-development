## Defining a route:

This app uses route files to handle interaction between the main app context (`app`) and the libraries that do not have access to the global context. These route files are compiled as modules when `r.js` runs at deployment, making them include all utilities needed to run that route.



### The `assets/javascripts/routes/route_name.js` File:

Here is a generic route file. Change the name of the library name and the `return` statement, then add your content:

```javascript
'use strict';

define([
	'postal'
	// Libraries go here:
], function(
	postal
) {
	var GenericRoute = function(app) {
		
		var channel = {};
		channel['route'] = post.channel('route');
		
		// Your code goes here:
		
		channel['route'].dispatch({actionType: 'route:ready' });
	}
	return GenericRoute;
});
```

### Hooking up the route:

In the `assets/javascripts/app.js` file, find the `app.routes` object and add the route. For the key, use the route or routes you want the Router to look for. For the value, use the name of the route file you made above.

## Deploying

In order to deploy the packed version of the application, run `rake deploy` from your terminal. Make sure to edit `Rakefile` to define the deployment location (we deploy using SSH, at the moment).

If you want to merely create a packed version of the app and deploy yourself, run `rake assets:pack` in the terminal.