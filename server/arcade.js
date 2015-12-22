// connect to the server
var socket = io.connect(site + '/arcade');
// register as an arcade view
socket.emit('message', { text: 'hello' }, 'arcade');
// setup basic messaging
socket.on('message', function(message, from) {
	console.log(from + ': ' + message.text);
});

var NUMBER_OF_GAMES = -1; //init at -1 cause we do counting and want  to use this to access an array-like element, dont change
var icons = 16;
var columns = 4;
var selected_game = 0;
var gamelist;

socket.on('up', function(from) {
	console.log('UP');

    var previously_selected_game = selected_game; //in order to save a $ call and to prevent flickering
    var current_column = (selected_game % columns) ;
    var next_game_in_current_column = (selected_game - columns);
    var last_game_in_current_column = 0;
    
    for( i=current_column; i<NUMBER_OF_GAMES; i+=columns){//find last game thorugh probing
        last_game_in_current_column = i;
    }
    
    selected_game = (next_game_in_current_column > -1) ? next_game_in_current_column : last_game_in_current_column;
    
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
});

socket.on('down', function(from) {
	console.log('DOWN');
    
    var previously_selected_game = selected_game; //in order to save a $ call and to prevent flickering
    var current_column = (selected_game % columns) ;
    var next_game_in_current_column = (selected_game + columns)
    
    /*if we're in last row go to first row- but keep column*/
    selected_game = (next_game_in_current_column <= NUMBER_OF_GAMES) ? next_game_in_current_column : current_column;
    
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
});

socket.on('left', function(from) {
	console.log('LEFT');
    
    var previously_selected_game = selected_game; //in order to save a $ call and to prevent flickering
    
    selected_game = (selected_game == 0) ? NUMBER_OF_GAMES : --selected_game;
    
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
});

socket.on('right', function(from) {
	console.log('RIGHT');
    
    var previously_selected_game = selected_game; //in order to save a $ call (don't remove same border and paint again
    
    selected_game = (selected_game < NUMBER_OF_GAMES) ? ++selected_game : 0;
    
    if(selected_game !== previously_selected_game){ //selected game has changed so move the border
        $( "#gallery" ).find("#game"+previously_selected_game).removeClass('selected_gallery_item');
        $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
    }
});

socket.on('tap', function(from) { 
	console.log('TAP');
   
	$("#gallery").hide();
    $("#playground").load("platformer.html");
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
      
      /*This element has a (visible) border. It's our default selection*/
      window.setTimeout(function(){
      $( "#gallery" ).find("#game"+selected_game).addClass('selected_gallery_item');
      }, 1000);
});
