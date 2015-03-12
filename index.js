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
    io.of('chat').emit('display chat message', msg);
    // socket.broadcast.emit('display chat message', msg);
  });
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
});

// io.of('/todos').on('connection', function(socket){
//   console.log('message: ' + 'todos connected');
//   socket.on('new todo', function(msg){
//     console.log('message: ' + msg);
//     io.emit('new todo message', msg);
//   });
// });

http.listen(3001, function(){
  console.log('listening on *:3001');
});
