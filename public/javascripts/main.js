  var socket = io.connect();
  socket.on('news', function (data) {
	$.each( data.items, function(i, ele) {	
		$('.news_items').append('<li>'+ele+'</li>');
	});
  });
  socket.on('newitem', function (data) {
	$('.news_items').prepend('<li>'+data.msg+'</li>');
  });

  $(document).ready( function() {
	$('.msg').keypress( function(e) {
		var code=e.which||e.keyCode;
		if(code==13) {
			socket.emit('newmsg', {msg:$(this).val()});
			$(this).val('');
		}
	} )
  });
