var router = require('express').Router();
var db = require('../db');

module.exports = router;

router.get('/', function(req, res, next){
    var userCount = 0,
        managerCount = 0,
        users = [];

    db.getUsers(1)
        .then(function(userList){
        managerCount = userList.length;
        users = userList;
        return db.getUsers(0);
    })
        .then(function(userList){
            userCount = userList.length + managerCount;
            users = users.concat(userList);
            res.render('users', {userCount, managerCount, users});
    })
        .catch(function(err){
            // console.log('in catch');
            next(err);
        });
});

router.get('/managers', function(req, res, next){
    var userCount = 0,
        managerCount = 0,
        users = [];

    db.getUsers(1)
        .then(function(userList){
        managerCount = userList.length;
        users = userList;
        return db.getUsers(0);
    })
        .then(function(userList){
            userCount = userList.length + managerCount;
            res.render('managers', {userCount, managerCount, users});
    })
        .catch(function(err){
            next(err);
        });

});

// Create User
router.post('/', function(req, res, next){
    var userName = req.body.name;
    var is_manager = parseInt(req.body.is_manager) || 0;
    // console.log(is_manager);
    db.createUser({name: userName, manager: is_manager})
        .then(function(){

            if (is_manager) res.redirect('/users/managers');
            else res.redirect('/users');
        })
        .catch(function(err){
            next(err)
        });
});

// Delete an user
router.delete('/:id', function(req, res, next){
    var id = req.params.id;
    // console.log('route detected');
    db.deleteUser(id).then(function(){
        res.redirect("/users");
    })
    .catch(function(err){
            next(err)
    });
});

// Either make an user manager or demote a manager to regular user
router.put('/:id', function(req, res, next){
    var is_manager = parseInt(req.body.is_manager);
    var id = req.params.id;
    db.updateUser({id, manager: is_manager})
        .then(function(){
            if(is_manager) res.redirect('/users/managers');
            else res.redirect('/users');
        })
        .catch(function(err){
            next(err);
        });
});
