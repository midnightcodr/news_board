
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config')
  , newsdb = require('./newsdb')
var all_items={};
function gg() {
	return (new Date()).getTime();
}
newsdb.connect( function(err) {
	if(err) throw err;
});
newsdb.setup( function(err) {
	if(err) {
		console.log('ERROR '+err);
		throw err;
	}
});
newsdb.load_news(config.limit, function(err, row) {
	all_items[row.ts]=row.news;
});

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('adminpass', config.adminpass);
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
		var ts=gg();
		var newsitem=[ts, m];
		all_items[ts]=m;
		newsdb.add(newsitem, function() {
			socket.emit('newitem', newsitem);
			socket.broadcast.emit('newitem',newsitem);
		});
	});
	socket.on('delmsg', function(d) {
		if(d.length<1) return;
		newsdb.del(d, function() {
			for(var i=0;i<d.length;i++) {
				delete all_items[d[i]];
			}
			socket.emit('delitem', d);
			socket.broadcast.emit('delitem', d);
		});
	});
});
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
