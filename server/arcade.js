// connect to the server
var socket = io.connect(site + '/arcade');
// register as an arcade view
socket.emit('message', { text: 'hello' }, 'arcade');
// setup basic messaging
socket.on('message', function(message, from) {
	console.log(from + ': ' + message.text);
});

var icons = 16;
var rows = 4;

socket.on('up', function(from) { //moving "up" means index shrinks
	console.log('UP');
    
    var previously_selected_game = selected_game; //in order to save a $ calls (don't remove same border and paint again)
    selected_game = (selected_game - 4 > 0) ? selected_game -= 4 : selected_game;
    if(selected_game === previously_selected_game){ //selected game has changed hence we must move the border
        $( "#gallery" ).find("#"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#"+selected_game).addClass('selected_gallery_item');
    }
	/*var c = parseInt($(':focus').attr('id'));
	var u = c > rows ? (c - rows) : (c + icons - rows);
	$('#' + u).focus();*/
});

socket.on('down', function(from) { //moving "down" means index grows bigger
	console.log('DOWN');
    
    var previously_selected_game = selected_game; //in order to save a $ calls (don't remove same border and paint again)
    selected_game = (selected_game + 4 < $("#gallery").length) ? selected_game+=4 : selected_game;
    if(selected_game === previously_selected_game){ //selected game has changed hence we must move the border
        $( "#gallery" ).find("#"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#"+selected_game).addClass('selected_gallery_item');
    }
    /*
	var c = parseInt($(':focus').attr('id'));
	var d = (icons - c) > rows ? (c + rows) : (c - icons + rows);
	$('#' + d).focus();*/
});

socket.on('left', function(from) {
	console.log('LEFT');
    selected_game = selected_game < 2 ? 0 : selected_game--;
    $( "#gallery" ).find("#"+selected_game).addClass('selected_gallery_item');
    /*
	var c = parseInt($(':focus').attr('id'));
	var l = c == 1 ? icons : (c - 1);
	$('#' + l).focus();*/
});

socket.on('right', function(from) {
	console.log('RIGHT');
    selected_game++;
    $( "#gallery" ).find("#"+selected_game).addClass('selected_gallery_item');
    
	/*var c = parseInt($(':focus').attr('id'));
	var r = c == icons ? 1 : (c + 1);
	$('#' + r).focus();*/
});

socket.on('tap', function(from) { 
	console.log('TAP');
	$(':focus').click();
	$('#icons').hide();
});

  var selected_game = "game0";
  
$(document).ready(function(){

	jQuery('#qrcodeTable').qrcode({
		render	: "table",
		text	: site
	});
	
    var gamelist = jQuery.getJSON("game_db.json", function (data){
       var items = [];
       $.each( data['game_db'], function( key, val ) {
         items.push( "<div id=game" + key + " class=gallery_item>" ); //open div tag
            items.push(("<img src=" + val["icon"] + " alt=" + val["name"]  +">")); //embed image
         items.push("</div>");
       });
     
       $( "<div>", {
         "id": "gallery",
         html: items.join( "" )
       }).insertBefore( "#playground" );
      });
      
      /*This element has a (visible) border*/
      window.setTimeout(function(){
      $( "#gallery" ).find("#"+selected_game).addClass('selected_gallery_item');
      //$( "#gallery" ).addClass("selected_gallery_item");
      }, 1000);
      //$("game0").removeClass('selected_gallery_item');
});