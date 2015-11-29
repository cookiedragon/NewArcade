// connect to the server
var socket = io.connect('http://192.168.2.114:8080/arcade');
// register as an arcade view
socket.emit('message', { text: 'hello' }, 'arcade');
// setup basic messaging
socket.on('message', function(message, from) {
	console.log(from + ': ' + message.text);
});

// handle commands to navigate
function handleTap() {
	console.log('TAP');
}

socket.on('up', function(from) { console.log('UP'); });
socket.on('down', function(from) { console.log('DOWN'); });
socket.on('left', function(from) { console.log('LEFT'); });
socket.on('right', function(from) { console.log('RIGHT'); });
socket.on('tap', function(from) { handleTap() });

// load more content when button clicked
$(document).ready(function(){
  $("#platformer").click(function() {
    $("#playground").load("platformer.html");
  });
});
