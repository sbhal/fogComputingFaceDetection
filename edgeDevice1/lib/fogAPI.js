//var config = require('./config/config.js');

module.exports = function(myAllApps) {
    var config = myAllApps.config;
    var module = {};
    module.send_up = function(data) {
        console.log("send up called");
        myAllApps.socketParent.emit("on_message", data);
    },
        module.send_down = function(data) {
            console.log("on down");
            myAllApps.io.emit("on_message", data);
        },
        module.send_to = function() {
            console.log("on send to");
        },
        module.sense = function() {
            //Returns data from active sensor
            console.log("on sense");
        },
        module.queryLocation = function() {
            console.log('query location');
        },
        module.queryLevel = function() {
            //console.log("query level called");
            return config.level;
        },
        module.queryCapability = function() {
            console.log("query capability");
        },
        module.queryResource = function() {
            console.log("queryResource");
        },
        module.getObject = function() {
            console.log("getObject");
        },
        module.putObject = function() {
            console.log("putObject");
        }
    return module;
}