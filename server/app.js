var express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/todo_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

var todoSchema = new mongoose.Schema({
  text: String,
});

var Todo = mongoose.model("Todo", todoSchema);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.get("/todos", function(req, res){
  Todo.find({}, function(err, todos){
    if(err){
      console.log(err);
    } else {
        res.json(todos);
    }
  })
});

app.post("/todos", function(req, res){
  if(req.body.todo.text) {
    req.body.todo.text = req.sanitize(req.body.todo.text);
    var formData = req.body.todo;
    Todo.create(formData, function(err, newTodo){
      if(err){
        console.log(err);
      } else {
        res.json(newTodo);
      }
    });
  } else {
      res.json({error: "Invalid input!"});
  }
});

app.put("/todos/:id", function(req, res){
 Todo.findByIdAndUpdate(req.params.id, req.body.todo, {new: true}, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.json(todo);
   }
 });
});

app.delete("/todos/:id", function(req, res){
 Todo.findByIdAndRemove(req.params.id, function(err, todo){
   if(err){
     console.log(err);
   } else {
      res.json(todo);
   }
 }); 
});


app.listen(3000, function() {
  console.log('Server running on port 3000');
});