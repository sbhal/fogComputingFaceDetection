var socket = io.connect('http://localhost:3000', {
  forceNew: true
});
//console.log("entered");
socket.on('connect', function() {
  var heading = document.createElement('h4');
  heading.textContent = "Connection Established";
  document.getElementById('lightSwitch').appendChild(heading);

  socket.on('update', function(data) {
    if (data.event == "on")
      document.body.style.background = 'red';
    else
      document.body.style.background = 'black';
    addData(data);
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

socket.on('disconnect', function() {});