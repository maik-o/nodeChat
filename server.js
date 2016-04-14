var jade = require('jade');
var express = require('express'), app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var usernames = {};
var numUsers = 0;
var port = process.env.PORT || 5000;
app.set( __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
//app.configure(function(){
	app.use(express.static(__dirname+'/public'));
//});

app.get('/', function(req, res){
	res.render('home.jade');
});
server.listen(port, function(){
	console.log('Our app is running on http://localhost:'+ port);
});

io.sockets.on('connection', function (socket){
	//events go here
	var addedUser = false;
	// socket.on('setPseudo', function( data ){
	// 	//socket.set('pseudo', data);
	// 	socket.username = data;
	// 	usernames[data] = data;
	// 	++numUsers;
	// });

	socket.on('message', function (message){
		//socket.get('pseudo', function(error, name){
			var data = {'message' : message, pseudo : socket.username};
			socket.broadcast.emit('message', data);
			console.log("user " + socket.username + " send this : " + message);
		//});
	});

	socket.on('login', function(username){
		if(addedUser) return;

		socket.username = username;
		++numUsers;
		addedUser = true;

		socket.emit('login', {
			numUsers: numUsers
		});

		socket.broadcast.emit('user joined', {
			username: socket.username, numUsers: numUsers
		});
	});

	socket.on('logout', function(username){
		if(addedUser){
			--numUsers;

			socket.broadcast.emit('user left', {
				username: socket.username,
				numUsers: numUsers
			});
		}
	});
});
