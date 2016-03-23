var fogAPI = require('../lib/fogAPI.js');

module.exports = {
    on_create: function(){
        console.log("App is starting");
        //call query capability to know level and active sensors on this node
        var cap = fogAPI.queryCapability();
        
        //if cap has sensors
            fogAPI.sense();//then call sense function
    },
    on_sense: function(){
        //called only for passive sensors
        console.log("on message created");
    },
    on_message: function(){
        console.log("on message created");
    },
    on_new_child: function(){
        console.log("on message created");
    },
    on_new_parent: function(){
        console.log("on message created");
    },
    on_child_leave: function(){
        console.log("on message created");
    },
    on_parent_leave: function(){
        console.log("on new child created");
    }
}