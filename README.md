Documentation:

This application is used for Real time face detection using OpenCV, Node.js and Websockets
using Mobile fog programming model.


Requirements:
NodeJS
OpenCV
Webcam

Installation
npm install .

Running the Application:
node app.js <arg>
arg = cloud/ fog/ edge

The config file for cloudNode/fogNode/edgeDevice are present at /config/*.

Sample config file has:
{
  serverPort: 3001, //defines port on which server is going to start
  parentNodePort: 3000, //defines port of parent node
  level: 1, // defines network level in herirarchy.
  coords: {lat: 100, lon: 100}, // starting coordinates of device
  noOfSensors: 1, // number of sensors present
  sensorType: 'webcam' // type of sensor present
}


// sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');