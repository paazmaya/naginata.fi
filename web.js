/** naginata.fi **/

// http://expressjs.com
var express = require('express');
var fs = require('fs');
var md = require('marked').parse;

var app = express();
app.use(express.logger());
app.use(express.static(__dirname + '/public_html'));



// https://github.com/visionmedia/haml.js/
// app.engine('.haml', require('hamljs').renderFile);


// register .md as an engine in express view system
app.engine('md', function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    try {
      var html = md(str);
      html = html.replace(/\{([^}]+)\}/g, function(_, name){
        return options[name] || '';
      })
      fn(null, html);
    } catch(err) {
      fn(err);
    }
  });
});

app.set('views', __dirname);

// make it the default so we dont need .md
app.set('view engine', 'md');


app.get('/', function(req, res){
  res.render('README', { title: 'Markdown Example' });
})

app.get('/:lang', function(req, res){
  res.render('grading-rules-' + req.params.lang);
})

app.get('/fail', function(req, res){
  res.render('missing', { title: 'Markdown Example' });
})

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});