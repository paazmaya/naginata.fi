/** naginata.fi **/

// http://expressjs.com
var express = require('express');
var fs = require('fs');
var md = require('marked').parse;

var app = express();
app.use(express.logger());
app.use(express.static(__dirname + '/public_html'));


app.engine('jade', require('jade').__express);


app.set('views', __dirname);
app.set('view engine', 'jade');


app.get('/:lang', function(req, res){
  var file = 'grading-rules-' + (req.params.lang || 'engligh') + '.md'
  var data = fs.readFileSync(file, { encoding: 'utf8' });
  var html = md(data);
  res.render('index', { content: html });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});