const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); 

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://markhappy:mark9747!@cluster0.yvartod.mongodb.net/todoapp?retryWrites=true&w=majority', function(error, client){
    if(error){
        return console.log(error);
    }
    db = client.db('todoapp');
    app.listen(8080, function(){
        console.log('listening on 8080');
    });
});


app.get('/pet', function(request, response){
    response.send('펫펫펫');
});

app.get('/beauty', function(request, response){
    response.send('뷰티용품 사세요');
});
app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});
app.get('/write', function(request, response){
    response.sendFile(__dirname + '/write.html');
});
app.post('/add', function(request, response){
    response.send('전송완료');
    db.collection('counter').findOne({name : '게시물개수'}, function(error, result){
        console.log(result.totalPost);
        var totalPost = result.totalPost;
        db.collection('post').insertOne({_id: totalPost + 1, title : request.body.title, date : request.body.date}, function(error, result){
            console.log('save complete');
            db.collection('counter').updateOne({name : '게시물개수'},{$inc : {totalPost:1}},function(error, result){
                if(error){
                    return console.log(error);
                }
            });
        });
    });
   
});
app.get('/list', function(request, response){
    db.collection('post').find().toArray(function(error, result){
        console.log(result);
        response.render('list.ejs', { posts : result});
    });
    

});