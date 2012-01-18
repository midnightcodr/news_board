var sqlite3=require('sqlite3');
sqlite3.verbose();
exports.connect=function(cb) {
	db=new sqlite3.Database(__dirname+'/db/data.db'), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function(err) {
		if(err) {
			cb(err);
		} else {
			cb(null);
		}
	}
}
exports.disconnect=function(cb) {
	cb(null);
}
exports.setup=function(cb) {
	db.run("CREATE TABLE IF NOT EXISTS tbl_news(ts INTEGER PRIMARY KEY, news text)", function(err) {
		if(err) {
			console.log('Failed to create table '+err);
			cb(err);
		} else {
			cb(null);
		}
	});
}
exports.add=function(rec, cb) {
	db.run("REPLACE INTO tbl_news(ts, news) values (?, ?);", rec, function(err) {
		if(err) {
			console.log('Failed to add '+err);
			cb(err);
		} else {
			cb(null);
		}
	});
}
exports.del=function(arr_ts, cb) {
	var str_in=arr_ts.join(',');
	console.log('DELETE FROM tbl_news where ts in ('+str_in+');');
	db.run('DELETE FROM tbl_news where ts in ('+str_in+');', function(err) {
		if(err) {
			console.log('Failed to delete record(s) '+err);
			cb(err);
		} else {
			cb(null);
		}
	});
}
exports.load_news=function(num, doEach, done) {
	db.each('SELECT ts, news FROM tbl_news order by ts desc limit ?', [num], function(err, row) {
		if(err) {
			console.log('Failed to retrieve row '+err);
			done(err, null);
		} else {
			doEach(null, row);
		}
	});
}
