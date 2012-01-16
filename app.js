
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config')
var all_items_raw=config.init_news, all_items={}, ts_base=0.001;
console.log(all_items_raw);
function gg() {
	return (new Date()).getTime();
}
for(var i=0;i<all_items_raw.length;i++) {
	all_items[(gg()+ts_base).toString()]=all_items_raw[i];
	ts_base+=0.001; // to make the key unique
}
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
	socket.emit( 'news', all_items );
	socket.on('newmsg', function(d) {
		var m=d.msg;
		var tmp_id=gg();
		all_items[tmp_id.toString()]=m;
		socket.emit('newitem', [tmp_id, m]);
		socket.broadcast.emit('newitem',[tmp_id, m]);
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
