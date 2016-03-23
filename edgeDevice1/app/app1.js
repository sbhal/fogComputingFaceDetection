var fogAPI = require('../lib/fogAPI.js');

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

module.exports = {
    on_create: function(socket){
        console.log("App 1 is starting");
        //call query capability to know level and active sensors on this node
        //var cap = fogAPI.queryCapability();
        //if cap has sensors
            //then call sense function
        setInterval(function() {
        camera.read(function(err, im) {
            if (err) throw err;

            im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
                if (err) throw err;

                for (var i = 0; i < faces.length; i++) {
                    face = faces[i];
                    im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
                }

                socket.emit('on_message', {
                    buffer: im.toBuffer(),
                    coords: { lat: 100, lon: 100 },
                    appID: 1
                });
            });
        });
    }, camInterval);
    },
    on_sense: function(){
        //called only for passive sensors
        console.log("on message created");
    },
    on_message: function(){
        console.log("on message created");
    },
    on_new_child: function(){
        console.log("on message created");
    },
    on_new_parent: function(){
        console.log("on message created");
    },
    on_child_leave: function(){
        console.log("on message created");
    },
    on_parent_leave: function(){
        console.log("on new child created");
    }
}