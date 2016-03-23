var path = require('path')

module.exports = {
  httpPort: 8080,
  staticFolder: path.join(__dirname + '/../../../client'),
  level: 0,
  coords: {lat: 100, lon: 100},
  noOfSensors: 1,
  sensorType: 'webcam'
};