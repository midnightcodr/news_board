
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
var all_items=[ "what's up everyone?", "how's last night's sleep", "I have back pain.", "lovely day" ];

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/news', routes.news_pub);

var io=require('socket.io').listen(app);
app.listen(3000);
io.sockets.on('connection', function( socket ) {
	socket.emit( 'news', { items: all_items  } );
	socket.on('newmsg', function(d) {
		var m=(new Date()).toString()+' '+d.msg;
		var o={msg: m};
		all_items.push(m);
		socket.emit('newitem',o );
		socket.broadcast.emit('newitem',o );
		//io.sockets.broadcast.emit('newitem', o); 
	});
	socket.on('delmsg', function(d) {
		if(d.length<1) return;
		for(var i=0;i<d.length;i++) {
			delete all_items[d[i]];
		}
		socket.emit('delitem', d);
		socket.broadcast.emit('delitem', d);
	});
});
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
