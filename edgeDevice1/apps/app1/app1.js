
var path = require("path");
var io;
var conn_established = 0;

module.exports = function(myAllApps) {
    var fogAPI = require(path.join(__dirname, '../..', "lib", "fogAPI.js"))(myAllApps);
    var module = {};
    module.on_create = function(socket) {
        if (fogAPI.queryLevel() == 0) {
            console.log("App 1 is starting at edge");
            //call query capability to know level and active sensors on this node
            //var cap = fogAPI.queryCapability();
            //if cap has sensors
            //then call sense function
            var cv = require('opencv');

            // camera properties
            var camWidth = 320;
            var camHeight = 240;
            var camFps = 10;
            var camInterval = 1000 / camFps;

            // face detection properties
            var rectColor = [0, 255, 0];
            var rectThickness = 2;

            // initialize camera
            var camera = new cv.VideoCapture(0);
            camera.setWidth(camWidth);
            camera.setHeight(camHeight);

            setInterval(function() {
                camera.read(function(err, im) {
                    if (err) throw err;

                    //im.detectObject('../node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
                    im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
                        if (err) throw err;

                        for (var i = 0; i < faces.length; i++) {
                            face = faces[i];
                            im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
                        }

                        //console.log('<-- sending msg from edge');
                        socket.emit('on_message', {
                            buffer: im.toBuffer(),
                            coords: { lat: 100, lon: 100 },
                            appID: 1,
                            msgDirection: "up"
                        });
                    });
                });
            }, camInterval);
        } else if (fogAPI.queryLevel() == 1) {
            console.log("App 1 is starting at fog");
            //fog node
            console.log('fog node create');
        } else {
            console.log("App 1 is starting at cloud");
            //cloud node
            var express = require('express');
            var app = express();
            var server = require('http').createServer(app);
            io = require('socket.io')(server);
            app.use(express.static(__dirname));
            app.get('/', function(req, res) {
                res.sendFile(__dirname + '/index.html');
            });
            io.on('connection', function(socket) {
                conn_established = 1;
            });

            server.listen(2999);
        }
    },
        module.on_sense = function() {
            //called only for passive sensors
            console.log("on sense");
        },
        module.on_message = function(data) {
            console.log("on message created");
            if (fogAPI.queryLevel() == 0) {
                console.log('-->msg received on edge');
            } else if (fogAPI.queryLevel() == 1) {
                console.log('-->msg received on fog');
                // fogNode
                //console.log(data);
                if (data.msgDirection == "up") {
                    console.log('calling send up');
                    fogAPI.send_up(data);
                } else {
                    console.log('calling send down');
                    fogAPI.send_down(data);
                }
            } else {
                // cloud node
                console.log('msg received on cloud');
                if (io && conn_established === 1) {
                    io.sockets.emit('frame', data);
                }
            }
        },
        module.on_new_child = function() {
            console.log("on new child");
        },
        module.on_new_parent = function() {
            console.log("on new parent");
        },
        module.on_child_leave = function() {
            console.log("on child leave");
        },
        module.on_parent_leave = function() {
            console.log("on parent leave");
        }
    return module;
}