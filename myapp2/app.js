
var express = require('express');

var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.locals.pretty = true;

app.use(bodyParser.urlencoded({ exteneded: false }));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/topic/new', function(req,res){
    res.render('new');
});

app.get('/topic', function(req,res){
    fs.readdir('./data', function(err, files){

        if (err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }

        console.log(files);

        res.render('view', {topics:files});

    });
});

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


app.post('/topic', function(req,res){
    var title = req.body.title;
    var desc  = req.body.description;
    
    fs.writeFile('./data/' + title, desc, {encoding:'utf8'}, function(err){

        if (err) {
            console.log(err);
            // send 명령을 만나면 이후의 코드는 실행되지 않음.
            res.status(500).send('Internal Server Error');
        }
        
        console.log('File make Completed');
        res.send('Hi, Post');

    });

});

app.listen(3000, function(){
    console.log('Connected On 3000 Port!');
});
