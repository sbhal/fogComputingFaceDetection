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

/*
module.exports = function (socket) {
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;

        for (var i = 0; i < faces.length; i++) {
          face = faces[i];
          im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
        }

        socket.emit('frame', { buffer: im.toBuffer() });
      });
    });
  }, camInterval);
};
*/

module.exports = function(socket) {
  console.info('New client connected (id=' + socket.id + ').');
  clients.push(socket);
  socket.on('on_message', on_message_handler);
  socket.on('on_new_child', on_new_child_handler);
  socket.on('on_new_parent', on_new_parent_handler);
  socket.on('on_child_leave', on_child_leave_handler);
  socket.on('on_parent_leave', on_parent_leave_handler);
  socket.on('disconnect', function() {
    var index = clients.indexOf(socket);
    if (index != -1) {
      clients.splice(index, 1);
      console.info('Client gone (id=' + socket.id + ').');
    }
  });
};


function on_message_handler(data) {
  console.log("On message handler invoked");
  socketP.emit("on_message", data);
}

function on_new_child_handler(data) {
  console.log("On new child handler invoked");
}
//Sends a message from a child node to its parent node.
function on_new_parent_handler(data) {
  console.log("On new parent handler invoked");
}

//Sends a message from a node to its child nodes.
function on_child_leave_handler(data) {
  console.log("On child leave handler invoked");
}

//Sends a message to a specific destination node.
function on_parent_leave_handler(data) {
  console.log("On parent leave handler invoked");
}

function disconnect_handler(socket) {

}