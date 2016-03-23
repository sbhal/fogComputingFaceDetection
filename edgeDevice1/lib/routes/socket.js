var distance = require('gps-distance');

var coords = { lat: 110, lon: 110 },
    clients = [],
    thresDist = 100000;

//this function is invoked for every unique client connection
module.exports = function(socket) {
    console.info('New client connected (id=' + socket.id + ').');
    //clients.push(socket);

    if (socket.handshake.query.isParent == 1)
        socket.join('parent');
    else if (socket.handshake.query.isParent == 0) {
        socket.join("children");
    }
    
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
    //console.log("On message handler invoked");
    //console.log(distance(data.coords.lat, data.coords.lon, coords.lat, coords.lon));
    if (distance(data.coords.lat, data.coords.lon, coords.lat, coords.lon) > thresDist) {
        // if socket is parent
        //  then call on_child_leave to parent
        // and disconnect from socket
        if ('parent' in this.rooms)
            this.emit('on_child_leave', function(data) {
                console.log("sending on leave to parent");
                this.leave('parent');
            });

        //if socket is child
        //  then call on parent leave to childeren
        // and disconnect from child socket
        if ('children' in this.rooms)
            this.emit('on_parent_leave', function(data) {
                console.log("sending on leave to children");
                this.leave('children');
            });
    } else {
        //check the application for which msg has come
        //call application handler in app.js if msg for a app
        //take decision to return from here or send to parent/child
        
        //appIOT['fn']('appHandler'+data.appID, this, data);
        myAllApps['app'+data.appID](myAllApps).on_message(data); 
        
        //if msg is received from parent
        //    then send it to all my childrens
        if ('parent' in this.rooms){
            this.broadcast.to('childeren').emit('on_message', data);        
        }

        //if msg is received from children
        //  then send it my parent
        if ('children' in this.rooms) {
            this.broadcast.to('parent').emit('on_message', data);
            //socketP.emit("on_message", data);
        };
    }
}

//not used
function on_new_child_handler(data) {
    console.log("On new child handler invoked");
    // join the socket to childrens room
    this.join('childeren');
    myAllApps['app'+data.appID].on_new_child(this, data);
}

//not used
//Sends a message from a child node to its parent node.
function on_new_parent_handler(data) {
    console.log("On new parent handler invoked");
    // join the socket to parent room
    this.join('parent');
    myAllApps['app'+data.appID].on_new_parent(this, data);
}

//Sends a message from a node to its child nodes.
function on_child_leave_handler(data) {
    console.log("On child leave handler invoked");
    // remove socket from children room
    this.leave('childeren');
    myAllApps['app'+data.appID].on_child_leave(this, data);
}

//Sends a message to a specific destination node.
function on_parent_leave_handler(data) {
    console.log("On parent leave handler invoked");
    // remove socket from parent room
    this.leave('parent');
    myAllApps['app'+data.appID].on_parent_leave(this, data);
}

function disconnect_handler(socket) {
    console.log("Disconnected");
}