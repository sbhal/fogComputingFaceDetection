var socket = io.connect('http://localhost:2999', {
    forceNew: true
});
var canvas = document.getElementById('canvas-video');
var context = canvas.getContext('2d');
var img = new Image();

socket.on('connect', function() {
    var heading = document.createElement('h4');
    heading.textContent = "Connection Established";
    document.getElementById('sid').appendChild(heading);

    socket.on('update', function(data) {
        if (data.event == "on")
            document.body.style.background = 'red';
        else
            document.body.style.background = 'black';
        addData(data);
    });

    socket.on('frame', function(data) {
        /*  var heading = document.createElement('p');
          heading.textContent = "Connection";
          document.getElementById('sid').appendChild(heading);
        */// Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
        var uint8Arr = new Uint8Array(data.buffer);
        var str = String.fromCharCode.apply(null, uint8Arr);
        var base64String = btoa(str);

        img.onload = function() {
            context.drawImage(this, 0, 0, canvas.width, canvas.height);
        };
        img.src = 'data:image/png;base64,' + base64String;
    });

});

function addData(data) {
    // Create a list item to add to the page.
    var li = document.createElement('li');

    // Create an element for each piece of data in the phone call object.
    var callSid = document.createElement('h4');
    var to = document.createElement('h4');

    // Set the display text for each element.
    callSid.textContent = 'Call SID: ' + data.app_name;
    to.textContent = 'To: ' + data.event;

    // Append each line of text to our phone call list item.
    li.appendChild(callSid);
    li.appendChild(to);

    // Append the new object to the #phone-calls div.
    document.getElementById('lightSwitch').appendChild(li);
}

socket.on('disconnect', function() { });