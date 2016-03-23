var args = process.argv.slice(2);

global.myAllApps = {};
global.config = myAllApps.config = require('./lib/config/' + args[0] + '.js');
var normalizedPath = require("path").join(__dirname, "app");
myAllApps.appsCount = 0;
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    myAllApps['app' + file.replace(/[^0-9]/g, '')] = require(normalizedPath + '/' + file);
    myAllApps.appsCount++;
});

var fogAPI = require('./lib/fogAPI.js')(myAllApps);
// if this is edge level
// then just start client
// else start client and server
//if (fogAPI.queryLevel() != 0) {

function startServer(cb) {
    console.log('configuring SERVER');
    //HTTP Server
    myAllApps.server = require('http').createServer();
    // Websocket Server
    myAllApps.io = require('socket.io')(myAllApps.server);
    myAllApps.io.on('connection', function(socket){
        require('./lib/routes/socket')(socket);
        if(cb) cb(null, myAllApps);
    }); //this is socket
    myAllApps.server.listen(config.serverPort);

}
function connectClient(cb) {
    //connect to parent
    var io = require('socket.io-client');
    myAllApps.socketParent = io.connect("http://localhost:" + config.parentNodePort + "/", { query: "isParent=0" })

    myAllApps.socketParent.on('connect', function() {
        console.log('Client Node connected (id=' + myAllApps.socketParent.id + ').');
        // call on create handler of app
        if(cb) cb(null, myAllApps, this);
        //for (var i = 1; i <= myAllApps.appsCount; ++i)
        //    myAllApps['app' + i](myAllApps).on_create(this, "test"); //passing socket

        //require('./lib/routes/socket')(myAllApps);
    });
}

function startApps(err, myAllApps, socket){
    for (var i = 1; i <= myAllApps.appsCount; ++i)
            myAllApps['app' + i](myAllApps).on_create(socket, "test"); //passing socket
}

if (myAllApps.config.level == 0) {
    connectClient(startApps);
} else if (myAllApps.config.level == 1) {
    startServer();
    connectClient(startApps);
} else {
    //cloud node
    startServer(startApps);
}
