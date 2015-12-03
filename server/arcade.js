// connect to the server
var socket = io.connect('http://192.168.2.114:8080/arcade');
// register as an arcade view
socket.emit('message', { text: 'hello' }, 'arcade');
// setup basic messaging
socket.on('message', function(message, from) {
	console.log(from + ': ' + message.text);
});

var buttons = 16;
var rows = 4;

socket.on('up', function(from) {
	console.log('UP');
	var c = parseInt($(':focus').attr('id'));
	var u = c > rows ? (c - rows) : (c + buttons - rows);
	$('#' + u).focus();
});

socket.on('down', function(from) {
	console.log('DOWN');
	var c = parseInt($(':focus').attr('id'));
	var d = (buttons - c) > rows ? (c + rows) : (c - buttons + rows);
	$('#' + d).focus();
});

socket.on('left', function(from) {
	console.log('LEFT');
	var c = parseInt($(':focus').attr('id'));
	var l = c == 1 ? buttons : (c - 1);
	$('#' + l).focus();
});

socket.on('right', function(from) {
	console.log('RIGHT');
	var c = parseInt($(':focus').attr('id'));
	var r = c == buttons ? 1 : (c + 1);
	$('#' + r).focus();
});

socket.on('tap', function(from) { 
	console.log('TAP');
	$(':focus').click();
	$('#buttons').hide();
});

$(document).ready(function(){

	jQuery('#qrcodeTable').qrcode({
		render	: "table",
		text	: "http://192.168.2.114:8080"
	});
	
	for(i = 1; i <= buttons; i++) {
		$('<button/>', {
			text: 'Platformer ' + i,
			id: '' + i,
			click: function () {
				$("#playground").load("platformer.html");
			}
		}).appendTo('body');
		if (i % rows == 0) {
			$('</br>').appendTo('body');
		}
	}
	$('#1').focus();
});
