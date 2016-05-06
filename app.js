var args = process.argv.slice(2);
var glob = require("glob");
var path = require("path");
var fs = require('fs');

global.myAllApps = {};
myAllApps.myArray = {};
myAllApps.appsCount = 0;
var appPath = path.join(__dirname, "apps");
getDirectories(appPath).forEach(function (dir) {
    myAllApps['app' + dir.replace(/[^0-9]/g, '')] = require(path.join(appPath, dir, dir + ".js"));
    myAllApps.appsCount++;
});

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function (file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

glob("*/app*.js", { cwd: appPath }, function (err, files) {
    files.forEach(function (file) {
    })
})

global.config = myAllApps.config = require(path.join(__dirname, "lib", "config", args[0] + '.js'));

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
    myAllApps.io.on('connection', function (socket) {
        require('./lib/routes/socket')(socket);
        if (cb) cb(null, myAllApps);
    }); //this is socket
    myAllApps.server.listen(config.serverPort);

}
function connectClient(cb) {
    //connect to parent
    var io = require('socket.io-client');
    myAllApps.socketParent = io.connect("http://localhost:" + config.parentNodePort + "/", { query: "isParent=0" })

    myAllApps.socketParent.on('connect', function () {
        console.log('Client Node connected (id=' + myAllApps.socketParent.id + ').');
        // call on create handler of app
        if (cb) cb(null, myAllApps, this);
        //for (var i = 1; i <= myAllApps.appsCount; ++i)
        //    myAllApps['app' + i](myAllApps).on_create(this, "test"); //passing socket
        //safdar
        myAllApps.socketParent.on('on_message', function (data) {
            myAllApps.myArray[data.pktId.toString()].endTime = Date.now();
            if(Object.keys(myAllApps.myArray).length == 20){
                console.log(myAllApps.myArray);
                process.exit();
            }
            console.log(Date.now() + " msg down recteived with pkt ID " + data.pktId);
            if(myAllApps.io)
                myAllApps.io.emit("on_message", data);
        });

        //require('./lib/routes/socket')(myAllApps);
    });
}

function startApps(err, myAllApps, socket) {
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
