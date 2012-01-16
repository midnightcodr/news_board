
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.news_pub = function(req, res){
  var user_role=req.param('key')==req.app.settings.adminpass? 'admin': 'operator';
  res.render('news_pub', { 
	title: 'News Board', 
	user_role: user_role
  })
};
