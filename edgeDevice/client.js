var io = require('socket.io-client'),
    socket = io.connect("http://localhost:3001/", { query: "isParent=0" })
//var socket = require("socket.io-client")("http://localhost:3001/");
/*
var onInterval = setInterval(function() {
	socket.emit("on_message", {
		app_name: "lightSwitch",
		event: "on"
	});
}, 2000);

var offInterval = setInterval(function() {
	socket.emit("on_message", {
		app_name: "lightSwitch",
		event: "off"
	});
}, 3000);

socket.on("disconnect", function() {
	clearInterval(onInterval);
	clearInterval(offInterval);
});
*/

socket.on('connect', function() {

    console.log('EdgeDevice connected (id=' + socket.id + ').');

    socket.on('on_message', function(data) {
        console.log("msg sent");
    });
    require('./lib/routes/socket')(socket);
});