var socket = require("socket.io-client")("http://localhost:3001/");

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