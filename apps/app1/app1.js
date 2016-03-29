
var path = require("path");
var io;
var conn_established = 0;
var cv = require('opencv');
var PythonShell = require('python-shell');
var fs = require('fs');

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


            // webcamera properties
            var camWidth = 320;
            var camHeight = 240;
            var camFps = 10;
            var camInterval = Math.round(1000 / camFps);

            // face detection properties
            var rectColor = [0, 255, 0];
            var rectThickness = 2;
            var counter = 0;
            //var prevIm = new cv.Matrix(camHeight, camWidth);
            var prevIm;
            //console.log("--------first----------->", prevIm.width(), prevIm.height());
            try {
                // initialize camera
                var camera = new cv.VideoCapture(0);
                camera.setWidth(camWidth);
                camera.setHeight(camHeight);

                setInterval(function() {
                    camera.read(function(err, im) {
                        if (err) throw err;
                        counter++;
                        if (!prevIm)
                            prevIm = im;

                        var diff = new cv.Matrix(im.width(), im.height());

                        //process.exit(0);
                        //var d1 = self._d1;
                        //var d2 = self._d2;
                        //var motion = new cv.Matrix(im.width(), im.height());
                        //console.log("------------------->", im.width(), im.height(), prevIm.width(), prevIm.height());
                        //d1.absDiff(prevFrame, nextFrame);
                        //d2.absDiff(nextFrame, currentFrame);
                        diff.absDiff(prevIm, im);

                        //motion.bitwiseAnd(d1, d2);
                        diff.threshold(35, 255);
                        diff.erode(2);

                        var meanStdDev = diff.meanStdDev();
                        var stddev = meanStdDev.stddev.get(0, 0);

                        var detected = (stddev >= 5);
                        console.log(detected, stddev);
                        if (detected === true) {
                            socket.emit('on_message', {
                                buffer: im.toBuffer(),
                                coords: { lat: 100, lon: 100 },
                                appID: 1,
                                msgDirection: "up"
                            });
                        }
                        prevIm = im;
                        //dif.save(path.join(__dirname,"imgs" ,"im" + counter + ".jpg"));
                        //im.detectObject('../node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
                        /* im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
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
                         });*/
                    });
                }, camInterval);
            } catch (e) {
                console.log("Couldn't start camera:", e);
            }
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
                cv.readImage(data.buffer, function(err, im) {
                    if (err) throw err;
                    if (im.size()[0] > 0 && im.size()[1] > 0) {

                        im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
                            if (err) throw err;
                            if (!faces.length) return console.log("No Faces");

                            var face = faces[0];
                            var ims = im.size();
                            var im2 = im.roi(face.x, face.y, face.width, face.height)
                            /*
                            im.adjustROI(
                                 -face.y
                               , (face.y + face.height) - ims[0]
                               , -face.x
                               , (face.x + face.width) - ims[1])
                               */
                            //im2.save('./examples/tmp/take-face-pics.jpg')
                            data.buffer = im2.toBuffer();

                            if (data.msgDirection == "up") {
                                console.log('calling send up');
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

            } else {
                // cloud node
                console.log('msg received on cloud');
                if (io && conn_established === 1) {
                    io.sockets.emit('frame', data);
                    var options = {
                        mode: 'binary',
                        pythonOptions: ['-u'],
                        scriptPath: path.join(__dirname, "pyopencv"),
                        args: ["image.jpg"]
                    };
                    /*
                    fs.writeFile(path.join(__dirname, "pyopencv", "image.jpg"), data.buffer, 'binary', function(err) {
                        if (err)
                            console.log(err);
                        else
                            console.log("The file was saved!");
                    });*/
                    
                    var img = new Buffer(data.buffer, 'binary').toString('base64');
                    console.log(img);
                    var output = '';
                    var pyshell = new PythonShell('find_image.py', options);
                    //pyshell.send(img);
                    pyshell.stdout.on('data', function(data) {
                        output += '' + data;
                    });
                    pyshell.on('message', function(message) {
                        // received a message sent from the Python script (a simple "print" statement)
                        console.log("--->", message);
                    });
                    pyshell.end(function(err) {
                        if (err) throw err;
                        console.log("Output is                       ", output);
                        //process.exit();
                    });
                    /*
                    PythonShell.run("find_image.py", options, function(err, results) {
                        if (err) throw err;
                        // results is an array consisting of messages collected during execution
                        console.log('results: %j', results);
                    });*/
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