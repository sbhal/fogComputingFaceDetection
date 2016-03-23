var config = require('./config/config.js'); 

module.exports = {
    send_up: function() {
        console.log("on message created");
    },
    send_down: function() {
        console.log("on message created");
    },
    send_to: function() {
        console.log("on message created");
    },
    sense: function() {
        //Returns data from active sensor
        console.log("on message created");
    },
    queryLocation: function() {
        console.log("on message created");
    },
    queryLevel: function() {
        console.log("query level called");
        return config.level;
    },
    queryCapability: function() {
        console.log("on message created");
    },
    queryResource: function() {
        console.log("on new child created");
    },
    getObject: function() {
        console.log("on new child created");
    },
    putObject: function() {
        console.log("on new child created");
    }

}