//Following example code from: https://github.com/socketio/socket.io/tree/master/examples/chat
$(function(){

	var FADE_TIME = 150; // ms
	var TYPING_TIMER_LENGTH = 400; // ms
	var COLORS = [
	'#e21400', '#91580f', '#f8a700', '#f78b00',
	'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
	];

	$('.chat.page').hide();
	//$("#chatControls").hide();
	//$("#pseudoSet").click(function(){setPseudo();});
	//$("#submit").click(function(){sentMessage();});
	$(window).keydown(function (event) {
		// When the client hits ENTER on their keyboard
		if (event.which === 13) {
			if (username) {
			sentMessage();
			//socket.emit('stop typing');
			typing = false;
			} 
			else {
				setPseudo();
			}
		}
	});

	var socket = io.connect();

	function addMessage(msg, pseudo){
		$(".messages").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
	}

	// function log (message, options) {
	// 	var $el = $('<li>').addClass('log').text(message);
	// 	addMessageElement($el, options);
	// }


	function sentMessage(){
		if( $('#messageInput').val()!=""){
			socket.emit('message',$('#messageInput').val());
			addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
			$('#messageInput').val('');
		}
	}

	function setPseudo(){
		if( $('#psuedoInput').val() !=""){
			socket.emit('login', $("#pseudoInput").val());
			$('.chat.page').show();
			$('.login.page').hide();
			// $('#pseudoSet').hide();
		}
	}

	function addUserMessage (data){
		var message = '';
		if( data.numUsers === 1 ){
			message += "there is 1 user";
		}
		else{
			message += "there are " + data.numUsers+ " users";
		}

		addMessage(message, 'Server');
	}

	socket.on('message', function(data){
		addMessage(data['message'], data['pseudo']);
	});

	socket.on('login', function(data){
		addUserMessage(data);
	});
	socket.on('user joined', function (data) {
		log(data.username + ' joined');
		addUserMessage(data);
	});

});