// connect to the server
var socket = io.connect(site + '/arcade');
// register as an arcade view
socket.emit('message', { text: 'hello' }, 'arcade');
// setup basic messaging
socket.on('message', function(message, from) {
	console.log(from + ': ' + message.text);
});

var NUMBER_OF_GAMES = -1; //init at -1 cause we do counting and want  to use this to access an array-like element, dont change
var NUMBER_OF_ROWS; //initialized in document.ready(), dont change
var icons = 16;
var rows = 4;
var selected_game = 0;
var gamelist;

socket.on('up', function(from) {
	console.log('UP');


	/*var c = parseInt($(':focus').attr('id'));
	var u = c > rows ? (c - rows) : (c + icons - rows);
	$('#' + u).focus();*/
});

socket.on('down', function(from) {
	console.log('DOWN');
    
    var previously_selected_game = selected_game; //in order to save a $ call and to prevent flickering
    var current_column = (selected_game % rows) ;
    var next_game_in_current_column = (selected_game + rows)
    
    /*if we're in last row go to first row- but keep column*/
    selected_game = (next_game_in_current_column <= NUMBER_OF_GAMES) ? next_game_in_current_column : current_column;
    
    $("body").append(NUMBER_OF_GAMES +" col: " + current_column +"</br>");
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
    /*
	var c = parseInt($(':focus').attr('id'));
	var d = (icons - c) > rows ? (c + rows) : (c - icons + rows);
	$('#' + d).focus();*/
});

socket.on('left', function(from) {
	console.log('LEFT');
    
    var previously_selected_game = selected_game; //in order to save a $ call and to prevent flickering
    
    selected_game = (selected_game == 0) ? NUMBER_OF_GAMES : --selected_game;
    
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
    /*
	var c = parseInt($(':focus').attr('id'));
	var l = c == 1 ? icons : (c - 1);
	$('#' + l).focus();*/
});

socket.on('right', function(from) {
	console.log('RIGHT');
    
    var previously_selected_game = selected_game; //in order to save a $ call (don't remove same border and paint again
    
    selected_game = (selected_game < NUMBER_OF_GAMES) ? ++selected_game : 0;
    
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
	/*var c = parseInt($(':focus').attr('id'));
	var r = c == icons ? 1 : (c + 1);
	$('#' + r).focus();*/
});

socket.on('tap', function(from) { 
	console.log('TAP');
    
    var previously_selected_game = selected_game; //in order to save a $ call and to prevent flickering
    var current_column = (selected_game % rows) ;
    var next_game_in_current_column = (selected_game - rows);
    var last_game_in_current_column = NUMBER_OF_GAMES - (3 + NUMBER_OF_GAMES % rows); //FIXME: Im wrong
    
    selected_game = (next_game_in_current_column > 0) ? next_game_in_current_column : last_game_in_current_column;
    
    $("body").append("selected: " + selected_game +" max: " + last_game_in_current_column +"</br>");
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
	//$(':focus').click();
	//$('#icons').hide();
});
  
$(document).ready(function(){

	jQuery('#qrcodeTable').qrcode({
		render	: "table",
		text	: site
	});
	
       gamelist = jQuery.getJSON("game_db.json", function (data){
       var items = [];
       $.each( data['game_db'], function( key, val ) {
        NUMBER_OF_GAMES++; //TODO: is there any smart way to get the number of games in db? gamelist.length wont work
         items.push( "<div id=game" + key + " class=gallery_item>" ); //open div tag
         items.push(("<img src=" + val["icon"] + " alt=" + val["name"]  +">")); //embed image
         items.push("</div>");
       });     
       $( "<div>", {
         "id": "gallery",
         html: items.join( "" )
       }).insertBefore( "#playground" );
      });
      
      NUMBER_OF_ROWS = Math.trunc(NUMBER_OF_GAMES / rows);
      
      /*This element has a (visible) border. It's our default selection*/
      window.setTimeout(function(){
      $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
      }, 1000);
});
