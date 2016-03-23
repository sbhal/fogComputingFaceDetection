module.exports = function (myAllApps){
var fogAPI = require('../lib/fogAPI.js')(myAllApps);
    var module = {};
    module.on_create= function(){
        console.log("App 2 is starting");
        //call query capability to know level and active sensors on this node
        //var cap = fogAPI.queryCapability();
        //if cap has sensors
            //then call sense function
    },
    module.on_sense= function(){
        //called only for passive sensors
        console.log("on message created");
    },
    module.on_message= function(){
        console.log("on message created");
    },
    module.on_new_child= function(){
        console.log("on message created");
    },
    module.on_new_parent= function(){
        console.log("on message created");
    },
    module.on_child_leave= function(){
        console.log("on message created");
    },
    module.on_parent_leave= function(){
        console.log("on new child created");
    }
    return module;
}