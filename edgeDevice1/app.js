var fogAPI = require('./lib/fogAPI.js');

var myAllApps = {};
var normalizedPath = require("path").join(__dirname, "app");
myAllApps.appsCount = 0;
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  myAllApps['app'+file.replace(/[^0-9]/g,'')] = require(normalizedPath +'/'+ file);
  myAllApps.appsCount++;
});

// if this is edge level
// then just start client
// else start client and server
if (fogAPI.queryLevel() != 0) {
    //HTTP Server
    myAllApps.server = require('http').createServer();
    // Websocket Server
    myAllApps.io = require('socket.io')(myAllApps.server);
    //myAllApps.io.on('connection', require('./lib/routes/socket')(this)); //this is socket
myAllApps.server.listen(3002);
}


//connect to parent
var io = require('socket.io-client');
myAllApps.socketParent = io.connect("http://localhost:3001/", { query: "isParent=0" })

myAllApps.socketParent.on('connect', function() {
    console.log('Client Node connected (id=' + myAllApps.socketParent.id + ').');
    // call on create handler of app
    for(var i=1; i <= myAllApps.appsCount; ++i)
        myAllApps['app'+i].on_create(this, "test"); //passing socket
    
    //require('./lib/routes/socket')(myAllApps);
});
