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

module.exports = function(socket) {
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
};
