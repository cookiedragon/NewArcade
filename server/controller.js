var noSleep = new NoSleep();

noSleep.enable();

// connect to the server
var socket = io.connect('http://192.168.2.114:8080/controller');
// generate a unique id
var client = new Date().getTime();
// register as a client
socket.emit('message', { text: 'hello' }, client);

// listen for tilt events to navigate
if (window.DeviceOrientationEvent) {
document.write("New Arcade");
	console.log("DeviceOrientation is supported");
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
}else{
document.write("DeviceOrientation is not supported");
}

// listen for taps
window.addEventListener("touchstart", function (e) {
	e.preventDefault();
	socket.emit('tap', client);
}, false);
