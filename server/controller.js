var noSleep = new NoSleep();

noSleep.enable();

// connect to the server
var socket = io.connect(site + '/controller');
// generate a unique id
var client = new Date().getTime();
// register as a client
socket.emit('message', { text: 'hello' }, client);

// if tilt is supported
if (window.DeviceOrientationEvent) {
document.write("New Arcade");
	document.write("DeviceOrientation is supported");
	
	// listen for tilt events to navigate
	var events = 0;
	window.addEventListener('deviceorientation', function(eventData) {
		events += 1;
		if (events == 30) {
			events = 0;
			// send commands when tilted
			if (eventData.gamma < -10) { socket.emit('left' , client); } 
			else if (eventData.gamma > 10) { socket.emit('right' , client); }
			else if (eventData.beta > 15) { socket.emit('up', client); }
			else if (eventData.beta < -5) { socket.emit('down', client); }
		}
	}, false);
	
	// listen for taps
	window.addEventListener("touchstart", function (e) {
		e.preventDefault();
		socket.emit('tap', client);
	}, false);
}else{ // ... do a fallback with stupid buttons
	document.write("DeviceOrientation is not supported");
}

function handleButton(action) {
	socket.emit(action, client);
}

// listen for touch buttons
var upButton = document.getElementById("upButton");
upButton.addEventListener("touchstart", handleButton('up'), false);
var downButton = document.getElementById("downButton");
downButton.addEventListener("touchstart", handleButton('down'), false);
var leftButton = document.getElementById("leftButton");
leftButton.addEventListener("touchstart", handleButton('left'), false);
var rightButton = document.getElementById("rightButton");
rightButton.addEventListener("touchstart", handleButton('right'), false);
var checkButton = document.getElementById("checkButton");
checkButton.addEventListener("touchstart", handleButton('tap'), false);
