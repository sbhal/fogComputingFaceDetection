var path = require('path')

module.exports = {
  serverPort: 3000,
  staticFolder: path.join(__dirname + '/../../../client'),
  level: 2,
  coords: {lat: 100, lon: 100},
  noOfSensors: 1,
  sensorType: 'webcam'
};