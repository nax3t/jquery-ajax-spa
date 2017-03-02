# SPA Refactor

### **Important Note**: 
Make a backup of your project _before_ following these instructions!

##Folder restructure

####Instructions:


- Rename your project folder. From inside of `/ajax-jquery-tutorial` run the following:

	`cd .. && mv ajax-jquery-tutorial server`

- Create a new parent directory and move the server directory into it

	`mkdir to-do-app && mv server to-do-app`

- Change directories into the new project folder and create a client directory
	
	`cd to-do-app && mkdir client`

- Your folder structure should now look like this:

	-- /to-do-app
	
	------ /server
	
	------ /client
	
- Now move front-end folders and files from /server to /client
	
	- from the project's parent (to-do-app) directory: `mv server/public/css client && mv server/public/js client`
	- if you're using gulp & babel then run the following: `mv server/src client`
	- move index.ejs into /client and rename it to index.html: `mv server/views/index.ejs client/index.html`
	- copy the header.ejs content and footer.ejs content into index.html (replacing `<% include partials/header %>` and `<% include partials/footer %>`)
	- remove the EJS syntax from index.html and remove everything from inside of `<ul class="list-group" id="todo-list">`
	- index.html will now look like this:
	
```
<!DOCTYPE html>
<html>
  <head>
    <title>To Do SPA</title>
    <link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' rel='stylesheet' type='text/css'>
    <!-- Bootstrap CDN -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/styles.css">
  </head>
  <body>
    <!-- navbar -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">To Do App</a>
        </div>
      </div>
    </nav>

    <div class="container">
      <div class="row">
        <div class="col-md-6 col-md-offset-3">

          <h1>New Item</h1>
          <form action="/todos" method="POST" id="new-todo-form">
            <div class="form-group">
              <label for="new-item">Item Text</label>
              <input type="text" name="todo[text]" class="form-control" placeholder="Walk the dog" id="new-item">
            </div>
            <button class="btn btn-primary">Create Item</button>
          </form>

          <h1>To Do Items</h1>
          <ul class="list-group" id="todo-list">
          </ul>

        </div>
      </div>
    </div>
    <!-- /.container -->

    <!-- jQuery CDN -->
    <script
    src="https://code.jquery.com/jquery-3.1.1.min.js"
    integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
    crossorigin="anonymous"></script>
    <!-- Bootstrap CDN -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>  
    <!-- AJAX JS -->
    <script src="./js/ajax.js"></script>
  </body>
</html>
```

- You can now delete the /public and /views directories from your /server folder, but **make sure** you have a backup of everything beforehand (this should have been done as the first step of the instructions)
- `rm -rf /server/public && rm -rf /server/views`

-----

- Follow the next steps **if you are using gulp**:
- Move the gulpfile from your server to your client with: `mv server/gulpfile.js client`
- Now open up /client/gulpfile.js and change line 10 to the following: `.pipe(gulp.dest('./js'))`
- Now initialize npm inside of the client with `cd client && npm init` then run through the instructions as you normally would, but when it asks for "entry point:" just press the spacebar one time then hit enter (return)
- Install the dependencies for babel and gulp, from inside of /client run: `npm i -S babel babel-preset-es2015 gulp gulp-babel gulp-connect`

-----
- **Note**: Continue with instructions even if not using gulp...
- Now you can go back into your /server/package.json and remove the following dependencies: **ejs**, **method-override**, and all of your **devDependencies** (babel, gulp, etc.)
- Your /server/package.json will look something like this now:

	```
	{
  		"name": "ToDo",
  		"version": "1.0.0",
  		"description": "",
  		"main": "app.js",
  		"scripts": {
    		"test": "echo \"Error: no test specified\" && exit 1"
  		},
  		"author": "Ian",
  		"license": "ISC",
  		"dependencies": {
    		"body-parser": "^1.14.1",
    		"express": "^4.13.3",
    		"express-sanitizer": "^1.0.1",
    		"mongoose": "^4.2.3"
  		}
	}
	```
- Open up /server/app.js and remove the following lines:
	- `app.set("view engine", "ejs");`
	- `app.use(express.static('public'));`
	- `app.use(methodOverride('_method'));`
	-  `methodOverride = require('method-override');`
- Be sure to update the boilerplate require code so the last item uses a semi-colon instead of a comma:
	- e.g., `expressSanitizer = require("express-sanitizer");` **not**: `expressSanitizer = require("express-sanitizer"),`


-----

##Enable CORS

####Instructions:

- Open /server/app.js and add the following code above your first route:


	```
	app.use(function(req, res, next) {
  		res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  		next();
	});
	```
- This will allow us to make AJAX requests to our API (server) from our client, you can read all about CORS [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

##Update client-side JS

####Instructions:

- If you're using gulp & babel then open /client/src/ajax.js, otherwise just open /client/js/ajax.js
- Wrap your code in a jQuery document ready function: `$(document).ready(function() { //your code here });`
- Above your "Create To Do Item" AJAX script, add in the following:
	
	```
	// Get All List Items

	$.get('http://localhost:3000/todos', function(todos) {
		todos.forEach(function(todo){
			$('#todo-list').append(
				`
				<li class="list-group-item">
					<form action="/todos/${todo._id}" method="POST" class="edit-item-form">
						<div class="form-group">
							<label for="${todo._id}">Item Text</label>
							<input type="text" value="${todo.text}" name="todo[text]" class="form-control" id="${todo._id}">
						</div>
						<button class="btn btn-primary">Update Item</button>
					</form>
					<span class="lead">
						${todo.text}
					</span>
					<div class="pull-right">
						<button class="btn btn-sm btn-warning edit-button">Edit</button>
						<form style="display: inline" method="POST" action="/todos/${todo._id}" class="delete-item-form">
							<button type="submit" class="btn btn-sm btn-danger">Delete</button>
						</form>
					</div>
					<div class="clearfix"></div>
				</li>
				`
				)
		})
	});
	```
- This is how we will load all of the To Do items on the page when we first visit the website
- Change your $.post('/todos',..) method to look like this: `$.post('http://localhost:3000/todos', toDoItem, function(data) {`
- Change the actionUrl variable definition for **both** your edit (put) and delete AJAX requests to this: `var actionUrl = 'http://localhost:3000' + $(this).attr('action');`
- Now we have the url for our API (http://localhost:3000) appended to the request url for all 4 of our AJAX calls
- We need to handle how our server deals with GET requests to '/todos' so let's down that now...

##Update server-side JS

####Instructions:

- Open up /server/app.js and update the app.get('/todos', ..) route with the following:

	```
	app.get("/todos", function(req, res){
  		Todo.find({}, function(err, todos){
    		if(err){
      			console.log(err);
    		} else {
      			res.json(todos);
    		}
  		})
	});
	```
	
-----

##Running your applications

####Instructions:

- Your apps should now be ready to run (I say apps, plural, because we now have a client side app and a server side app)

#### Server
- `cd` into `jquery-ajax-spa/server` and run `npm install` (just to be sure you have all of the node_modules you need)
- Start your mongo daemon `mongod` in a separate terminal tab
- Install `nodemon` globally (if you don't already have it installed) with `npm i -g nodemon`
- Run your server in its own terminal tab with `nodemon` or `node app`

#### Client
- **Note**: You can disregard the gulp instructions if you are not using gulp & babel in your project
- Navigate to `jquery-ajax-spa/client` in a separate terminal tab and run `npm install`
- Run an initial `gulp default` to be sure your transpiled JS file is up to date
- While working in development you can run `gulp watch` from a separate tab to listen for changes and tanspile your client-side JavaScript each time you update the `/client/src/ajax.js` file
- Run your client server from `/client` with `python -m SimpleHTTPServer` (Windows users see [here](http://stackoverflow.com/a/17351115/3176573))
- Navigate to `localhost:8000` in your browser