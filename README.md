## A very cool demo of socket.io module, need express, jade to run
	http://ip:3000/news	read-only access
	http://ip:3000/news?key=somepassword	admin access, change the adminpass key in config.js

## Quick start
	git clone git://github.com/midnightcodr/news_board.git
	npm install --global socket.io
	npm install --global express
	npm install --global jade
	npm install --global sqlite3	# only for sqlite3 branch, os needs to have sqlite and dev library installed
	cd news_board
	node app.js
