var path = require('path')

module.exports = {
  serverPort: 3002,
  parentNodePort: 3001,
  staticFolder: path.join(__dirname + '/../../../client'),
  level: 0,
  coords: {lat: 100, lon: 100},
  noOfSensors: 1,
  sensorType: 'webcam'
};