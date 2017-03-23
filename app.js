var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var pdf = require('html-pdf');
var needle = require('needle');
var multer = require('multer');

var exec = require('child_process').exec;
var cmd = 'lpr sample.pdf';

var options = { width: "58mm", height: "100mm" };

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/print', function(req, res){
	var html = ejs.render(fs.readFileSync('sample.html', 'utf8'), { text: fs.readFileSync('in.txt', 'utf8') });
	res.send(html);
});

app.post('/print_pdf', multer({
    dest: 'upload/',
    rename: function(fieldname, filename) {
        return "upload.pdf";
    },
    onFileUploadStart: function(file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function(file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
        exec(cmd, function(error, stdout, stderr) {
		 	console.log(error);
		 	console.log(stdout);
		 	console.log(stderr);
		});
    }
}).single('pdf'), function(req, res){
	res.send('done');
});


var httpServer = http.createServer(app);
httpServer.listen(80);

console.log('server started');