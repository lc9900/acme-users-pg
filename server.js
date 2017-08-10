const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');
const route = require('./routes/users');
const db = require('./db.js');

app.set('view engine', 'html')
app.engine('html', nunjucks.render);
nunjucks.configure('views', {noCache: true, express: app});

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

var port = process.env.PORT || 3000;

const server = app.listen(port, function(){
    db.syncAndSeed();
    console.log("server listening on port" + port);
})

app.use('/users', route);

app.get('/', function(req, res){
    var userCount = 0,
        managerCount = 0;
    db.getUsers(1)
        .then(function(userList){
        managerCount = userList.length;
        return db.getUsers(0);
    })
        .then(function(userList){
            userCount = userList.length + managerCount;
            res.render('index', {userCount, managerCount});
        });
});

app.use(function(err, req, res, next){
    res.render('error', {error: err});
});
