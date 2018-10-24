const 
  server = require('http').createServer(),
  io = require('socket.io')(server),
  subscriber = require("redis"),
  ROOM = "GENERAL"
;

io.on('connect', (socket) => {
  socket.on('room', (request) => {
    socket.join(ROOM);
    console.log('joined: ');
    console.log(request);
  });
});

server.listen(3333);
