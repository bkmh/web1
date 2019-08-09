
var express = require('express');

var bodyParser = require('body-parser');
var fs = require('fs');
var Path = require('path');
// File Handling -> express not afford file handling
var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });

var _storage = multer.diskStorage({
    // 사용자가 전송한 파일의 저장위치
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },

    // 사용자 전송한 파일의 파일명
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});


var upload = multer({ storage: _storage });

var app = express();

app.locals.pretty = true;

// static file 사용
app.use('/user', express.static('uploads'));


app.use(bodyParser.urlencoded({ exteneded: false }));

app.set('views', './views');
app.set('view engine', 'pug');

// 파일 업로드
app.get('/upload', function(req,res){
    res.render('upload_form');
});


// 해당 post 함수로 처리되기 전에 upload 즉, middleware인 multer가 수행된다.
// single 하위의 parameter에는 multipart form의 name이 입력되어야 한다.
app.post('/upload', upload.single('userFile'), function(req,res){
    console.log(req.file);
    res.send('Uploaded Complete : ' + req.file.filename);
});


// 동일한 주소에 대해 중복적으로 동일한 소스가 들어있으므로
// 해당 부분에 대해서는 구조를 변경하여 동일하게 기능 제공

app.get('/topic/new', function(req,res){

    fs.readdir('./data/', function(err,files){
        if (err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }

        res.render('new', {topics:files});
    });
});


//app.get('/topic', function(req,res){
app.get(['/topic', '/topic/:id'], function(req,res){

        var dataPath = './data/';

        fs.readdir('./data/', function(err, files){
    
            if (err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
    
            var topic = req.params.id;
    
            if (topic) {
                fs.readFile(dataPath + topic, {encoding: 'utf8'}, function(err, data){
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
             
                    res.render('view', {topics:files, title:topic, content:data});
             
                 });
    
                 
            } else {
                    res.render('view', {topics:files});
            }
    
        });
    });





/* 중복제거를 위한 구조 변경 후 주석처리
app.get('/topic/:id', function(req, res){
    
    var dataPath = './data/';
    var topic = req.params.id;
    
    fs.readdir(dataPath, function(err, files){

        if (err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }

        fs.readFile(dataPath + topic, {encoding: 'utf8'}, function(err, data){
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
     
            res.render('view', {topics:files, title:topic, content:data});
     
         });

    });
});
*/

app.post('/topic', function(req,res){
    var title = req.body.title;
    var desc  = req.body.description;
    
    fs.writeFile('./data/' + title, desc, {encoding:'utf8'}, function(err){

        if (err) {
            console.log(err);
            // send 명령을 만나면 이후의 코드는 실행되지 않음.
            res.status(500).send('Internal Server Error');
        }
        
        // 해당 경로를 다시 redirect 처리하는 방식
        res.redirect('/topic/'+title);

    });

});

app.listen(3000, function(){
    console.log('Connected On 3000 Port!');
});
