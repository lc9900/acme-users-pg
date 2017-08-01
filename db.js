var pg = require('pg');
var client = new pg.Client(process.env.DATABASE_URL);
var Promise = require('bluebird');
var seed = require('./seed.js');

client.connect(function(err){
    if (err) console.log(err.message);
})

function query(sql, params){
    return new Promise(function(resolve, reject){
        client.query(sql, params, function(err, result){
            if (err) reject(err);
            else resolve(err);
        });
    });
}

function sync() {
    query(seed.sql, [])
        .catch(function(err){
            console.log(err.message);
        });
}

// Return the list of rows for managers only
function(managersOnly){
    var sql = 'SELECT * FROM users where manager = $1';
    return query(sql, [parseInt(managersOnly)]).then(function(result){
                return result.rows;
            });
}

// Return a single row containing the user with the specified ID
function getUser(id){
    var sql = 'SELECT * FROM users WHERE id = $1';
    return query(sql, [id]).then(function(result){
               return result.rows[0];
            });
}

// Creating user and return the ID of the created user
function createUser(user){
    var sql = 'INSERT INTO users (name, manager) VALUES ($1, $2)';
    return query(sql, [user.name, parseInt(user.manager)])
            .then(function(result){
                return result.rows[0].id;
            });
}

// Deleting user
function deleteUser(id){
    var sql = 'DELETE FROM users where id = $1';
    return query(sql, [parseInt(id)]).then(function(){
        console.log(`${id} deleted`);
        return true;
    });
}

// Update an user. Really just promoting to a manager, or demoting to an user
function updateUser(user){
    var sql = 'UPDATE users SET manager = $1 WHERE id = $2';
    return query(sql, [parseInt(user.manager), parseInt(user.id)])
            .then(function(){
                console.log(`${user.name} is update to manager = ${user.manager}`);
                return true;
            });

}
