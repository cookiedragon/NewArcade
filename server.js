// setup server stuff
var cors = require('cors');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// listen to specific port
server.listen(8080);

// do cors stuff
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,access-control-allow-origin");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

// configure folder for static files
app.use(express.static('server'));
app.use(express.static('games'));

// handle default routing
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/server/controller.html');
});

// setup basic messaging with everyone
io.on('connection', function (socket) {
	socket.on('message', function(message, from) {
		console.log(from + ': ' + message.text);
  });
});

// messaging with the arcade view
var arcade = io.of('/arcade');
arcade.on('connection', function (socket) {
  socket.on('message', function(message, from) {
		console.log(from + ': ' + message.text);
		socket.emit('message', { text: 'hello' }, 'server');
  });
});

// pass on input events from the controller to the arcade view
function handleInput(action, from) {
	console.log(from + ': ' + action);
	arcade.emit(action, 'server');
}

// messaging with the controller
var controller = io.of('/controller');
controller.on('connection', function (socket) {
  socket.on('up', function(from) { handleInput('up', from) });
  socket.on('down', function(from) { handleInput('down', from) });
  socket.on('left', function(from) { handleInput('left', from) });
  socket.on('right', function(from) { handleInput('right', from) });
  socket.on('tap', function(from) { handleInput('tap', from) });
  socket.on('message', function(message, from) {
		console.log(from + ': ' + message.text);
  });
});
