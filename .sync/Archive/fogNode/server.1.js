//HTTP Server
var server = require('http').createServer();


var socketP = require("socket.io-client")("http://localhost:3000/", {
	forceNew: true
});
var sequence = 1,
	clients = [];
socketP.on('connect', function(socket) {
	socketP.on('update', function(data) {
		console.log('update received');
	});
});

// Websocket Server
var io = require('socket.io')(server);
io.on('connection', require('./lib/routes/socket'));

server.listen(3001);