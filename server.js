var jade = require('jade');
var express = require('express'), app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var usernames = {};
var numUsers = 0;
app.set( __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
//app.configure(function(){
	app.use(express.static(__dirname+'/public'));
//});

app.get('/', function(req, res){
	res.render('home.jade');
});
server.listen(80);

io.sockets.on('connection', function (socket){
	//events go here
	socket.on('setPseudo', function( data ){
		//socket.set('pseudo', data);
		socket.username = data;
		usernames[data] = data;
		++numUsers;
	});

	socket.on('message', function (message){
		//socket.get('pseudo', function(error, name){
			var data = {'message' : message, pseudo : socket.username};
			socket.broadcast.emit('message', data);
			console.log("user " + socket.username + " send this : " + message);
		//});
	});
});
