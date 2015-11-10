// require express and path
var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var querystring = require('querystring');
// create the express app
var app = express();
// static content
app.use(express.static(path.join(__dirname, "./static")));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded());
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
});


// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);
// Whenever a connection event happens (the connection event is built in) run the following code
io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  var user;
  //all the socket code goes in here!
  socket.on('got_new_user',function(data){
    console.log("new user is"+ data.name);
    user = data.name;
    socket.broadcast.emit("new_user",data);
  });
  socket.on('disconnect', function(){
    console.log(user+'disconnected');
  });


  socket.on("posted",function(data){
    console.log("here is" + " "+user+" "+"message"+" "+ data);
    //socket.emit('server_response', result);
    var message = user+" "+":"+" "+data;
    io.emit('posted',message);
  });


});
