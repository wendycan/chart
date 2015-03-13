var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.of('/chat').on('connection', function(socket){
  console.log('message: ' + 'connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.of('/chat').emit('display chat message', msg);
    // socket.broadcast.emit('display chat message', msg);
  });
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
});

io.of('/todos').on('connection', function(socket){
  var cookie_string = socket.request.headers.cookie;
  var sid = cookie_string.split('=')[1];
  var user = {sid: sid}

  socket.on('join chat', function (msg) {
    console.log('todos connected');
    user.name = msg;
    users.push(user);

    io.of('/todos').emit('join message', msg);
  });

  socket.on('todo changed', function(msg){
    console.log('message: ' + msg);
    io.of('/todos').emit('todo message', msg);
  });

  socket.on('add chart', function (msg) {
    console.log('message: ' + msg);
    io.of('/todos').emit('chart message', msg);
  });

  socket.on('disconnect', function (data) {
    console.log('message: leave' );
    var msg;

    for(var i in users) {
      if (users[i].sid == sid) {
        msg = users[i].name;
        var a = users.splice(i);
      };
    }
    io.of('/todos').emit('leave message', msg);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
