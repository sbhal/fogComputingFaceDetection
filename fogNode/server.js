//HTTP Server
var server = require('http').createServer();

// Websocket Server
var io = require('socket.io')(server);
io.on('connection', require('./lib/routes/socket'));

// server init done


// now connect to parent
var socketP = require("socket.io-client")("http://localhost:3000/", {
    forceNew: true
});

socketP.on('connect', function(socket) {
    socketP.on('update', function(data) {
        console.log('update received');
    });
});


server.listen(3001);