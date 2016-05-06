var path = require("path");
var io;
var conn_established = 0;
var cv = require('opencv');
var fs = require('fs');
var fogAPI = require(path.join(__dirname, '../..', "lib", "fogAPI.js"))(myAllApps);
var pktid = 0;

module.exports = {
    step1_onCreate: function (socket) {
        console.log("App 1 is starting at edge");

        // webcamera properties
        var camWidth = 320;
        var camHeight = 240;
        var camFps = 10;
        var camInterval = Math.round(1000 / camFps);

        // face detection properties
        var rectColor = [0, 255, 0];
        var rectThickness = 2;
        var counter = 0;
        var prevIm;
        try {
            // initialize camera
            var camera = new cv.VideoCapture(0);
            camera.setWidth(camWidth);
            camera.setHeight(camHeight);

            setInterval(function () {
                camera.read(function (err, im) {
                    if (err) throw err;
                    counter++;
                    if (!prevIm)
                        prevIm = im;
                    var diff = new cv.Matrix(im.width(), im.height());
                    diff.absDiff(prevIm, im);
                    diff.threshold(35, 255);
                    diff.erode(2);

                    var meanStdDev = diff.meanStdDev();
                    var stddev = meanStdDev.stddev.get(0, 0);

                    var detected = (stddev >= 5);
                    //console.log(detected, stddev);
                    console.log(Date.now() + " pkt send id is " + ++pktid);
                    if (detected === true) {
                        myAllApps.myArray[''+pktid] = {};
                        myAllApps.myArray[''+pktid].startTime = Date.now();
                        socket.emit('on_message', {
                            buffer: im.toBuffer(),
                            coords: { lat: 100, lon: 100 },
                            appID: 1,
                            msgDirection: "up",
                            pktId: pktid 
                        });
                    }
                    prevIm = im;
                });
            }, camInterval);
        } catch (e) {
            console.log("Couldn't start camera:", e);
        }
    },
    step2_onCreate: function (socket) {
        console.log("App 1 is starting at fog");
    },
    step3_onCreate: function (socket) {
        console.log("App 1 is starting at cloud");
        //cloud node
        var express = require('express');
        var app = express();
        var server = require('http').createServer(app);
        io = require('socket.io')(server);
        app.use(express.static(__dirname));
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
        io.on('connection', function (socket) {
            conn_established = 1;
        });
        server.listen(2999);
    },
    step1_onMessage: function (data) {
        console.log('-->msg received on edge' );
    },
    step2_onMessage: function (data) {
        if (data.msgDirection == "down") {
            console.log('-->msg down received on fog');
            fogAPI.send_down(data);
        } else {
            //safdar
            //sending response back to edge from fog node before fog node processing
            //fogAPI.send_down(data);

            cv.readImage(data.buffer, function (err, im) {
                if (err) throw err;
                if (im.size()[0] > 0 && im.size()[1] > 0) {

                    im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
                        if (err) throw err;
                        if (!faces.length) return console.log("No Faces");

                        var face = faces[0];
                        var ims = im.size();
                        var im2 = im.roi(face.x, face.y, face.width, face.height)
                        data.buffer = im2.toBuffer();
                        if (data.msgDirection == "up") {
                            //console.log('calling send up');
                            fogAPI.send_up(data);
                        } else {
                            console.log('calling send down');
                            fogAPI.send_down(data);
                        }
                    });
                } else {
                    console.log("Camera didn't return image");
                }
            });
            //sending response back to edge from fog node after fog node processing
            fogAPI.send_down(data);
        }
    },
    step3_onMessage: function (data) {
        console.log('msg received on cloud');
        if (io && conn_established === 1) {
            io.sockets.emit('frame', data);
        }
        data.msgDirection = "down";
        //safdar
        // below call sends down reply from cloud to fog node
        //fogAPI.send_down(data);
    }
}