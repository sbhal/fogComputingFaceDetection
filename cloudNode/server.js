var express = require('express');
var app = express();
//var http = require('http').Server(app);

//var redis = require('redis');
//var client = redis.createClient('6380', '127.0.0.1')

var sequence = 1,
	clients = [];

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.info('New client connected (id=' + socket.id + ').');
	clients.push(socket);
	socket.on('on_message', on_message_handler);
	socket.on('disconnect', function() {
		var index = clients.indexOf(socket);
		if (index != -1) {
			clients.splice(index, 1);
			console.info('Client gone (id=' + socket.id + ').');
		}
	});
});

function on_message_handler(data) {
	//console.log("On message handler invoked");
	//io.sockets.emit('update', data);
    io.sockets.emit('frame', data);
}

server.listen(3000);