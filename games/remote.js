// connect to the server
var socket = io.connect(site + '/game');
// register as an arcade view
socket.emit('message', { text: 'hello' }, 'game');
// setup basic messaging
socket.on('message', function(message, from) {
	console.log(from + ': ' + message.text);
});

var rightPressed = false;
var leftPressed = false;

socket.on('right', function(message, from) {
	triggerRemoteKey(39);
	rightPressed = true;
	leftPressed = false;
});
socket.on('left', function(message, from) {
	triggerRemoteKey(37);
	leftPressed = true;
	rightPressed = false;
});
socket.on('up', function(message, from) {
	triggerRemoteKey(38);
	rightPressed = false;
	leftPressed = false;
});
socket.on('down', function(message, from) {
	triggerRemoteKey(40);
	rightPressed = false;
	leftPressed = false;
});
