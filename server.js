const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method')); 


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

    response.render('index.ejs');
});
app.get('/write', function(request, response){
    response.render('write.ejs');
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
        response.render('list.ejs', { posts : result});
    });
    

});
app.delete('/delete', function(request, response){
    request.body._id = parseInt(request.body._id);
    db.collection('post').deleteOne(request.body, function(error, result){
        console.log('삭제완료');
        response.status(200);
    });
});
app.get('/detail/:id', function(request, response){
    db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
        console.log(result);
        response.render('detail.ejs', {data : result});
    });
    
});
app.get('/edit/:id', function(request, response){
    db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
        response.render('edit.ejs', {post : result});
    });
});
app.put('/edit', function(request,response){
    db.collection('post').updateOne({_id : parseInt(request.body.id)},{ $set : {title : request.body.title, date : request.body.date}},function(error, result){
        response.redirect('/list');
    });
});