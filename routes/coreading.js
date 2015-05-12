var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Coreading' });
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var users = [];
var usernames = [];

io.set('authorization', function (handshakeData, callback) {
  // findDatabyip is an async example function

  var token = handshakeData._query.token;
  request('http://localhost:3003/api/v1/user?auth_token=' + token, function (error, response, body) {
  // request('http://wendycan-local.com:3003/api/v1/user?auth_token=' + token, function (error, response, body) { //Rails use 3003!!!
    // to save to db
    if (JSON.parse(body).username) {
      console.log('success');
      callback(null, true);
    } else {
      console.log('failed');
      callback(null, false);
    }
  });
});
io.of('/annotations').on('connection', function(socket){
  var cookie_string = socket.request.headers.cookie;
  var sid = cookie_string.split('=')[1];
  var user = {sid: sid};

  socket.on('join chat', function (msg) {
    console.log('annotations connected');

    var index = usernames.indexOf(msg);
    if (index < 0) {
      user.name = msg;
      users.push(user);
      usernames.push(msg);
    } else {
      usernames[index].sid = sid;
    }

    var data = {
      currentUser: msg,
      users: usernames
    };

    io.of('/annotations').emit('join message', JSON.stringify(data));
  });

  socket.on('change annotation', function(msg){
    var address = socket.handshake.address;
    var data = JSON.parse(msg);
    data.ip = address;

    io.of('/annotations').emit('change annotation', JSON.stringify(data));
  });

  socket.on('add chart', function (msg) {
    var address = socket.handshake.address;
    var data = JSON.parse(msg);
    data.ip = address;

    io.of('/annotations').emit('chart message', JSON.stringify(data));
  });

  socket.on('disconnect', function (data) {
    console.log('message: leave' );

    var msg;
    for(var i in users) {
      if (users[i].sid == sid) {
        msg = users[i].name;
        users.splice(i, 1);
        usernames.splice(i, 1);
      };
    }

    io.of('/annotations').emit('leave message', msg);
  });

  socket.on('leave page', function () {
    console.log('message: leave' );

    var msg;
    for(var i in users) {
      if (users[i].sid == sid) {
        msg = users[i].name;
        users.splice(i, 1);
        usernames.splice(i, 1);
      };
    }

    io.of('/annotations').emit('leave message', msg);
  });

});
http.listen(3003, function(){
console.log('listening on *:3003');
});


module.exports = router;
