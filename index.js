var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
  console.log('todos connected');
  io.of('/todos').emit('join message');

  socket.on('todo changed', function(msg){
    console.log('message: ' + msg);
    io.of('/todos').emit('todo message', msg);
  });

  socket.on('add chart', function (msg) {
    console.log('message: ' + msg);
    io.of('/todos').emit('chart message', msg);
  });

  socket.on('disconnect', function () {
    console.log('message: leave' );
    io.of('/todos').emit('leave message');
  })
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
