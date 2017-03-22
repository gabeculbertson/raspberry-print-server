var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/print', function(req, res){
	var html = ejs.render(fs.readFileSync('sample.html', 'utf8'), { text: fs.readFileSync('in.txt', 'utf8') });
	res.send(html);
});

var httpServer = http.createServer(app);
httpServer.listen(80);

console.log('server started');