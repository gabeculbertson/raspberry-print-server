var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var needle = require('needle');
var multer = require('multer');

var exec = require('child_process').exec;
var cmd = 'lpr upload/upload.pdf';

var options = { width: "58mm", height: "100mm" };
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, 'upload.pdf')
  }
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/print', function(req, res){
	var html = ejs.render(fs.readFileSync('sample.html', 'utf8'), { text: fs.readFileSync('in.txt', 'utf8') });
	res.send(html);
});

var upload = multer({ storage: storage });
app.post('/print_pdf', upload.single('pdf'), function(req, res, next){
	exec(cmd, function(err, stdout, stderr){
		console.log(err, stdout, stderr);
	});
	res.send('done');
});


var httpServer = http.createServer(app);
httpServer.listen(80);

console.log('server started');
