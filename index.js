const 
  server = require('http').createServer(),
  io = require('socket.io')(server),
  subscriber = require("redis"),
  ROOM = "GENERAL"
;

io.on('connect', (socket) => {
  console.log('connected');
  socket.emit('USER_JOINED', { name: 'test user' });
  socket.emit('MESSAGE_RECEIVED', { user: 'test user', text: ' hello from the backend' });

  socket.on('users', () => {
    console.log('requesting USERS: ');
  });

  socket.on('message', (user, message) => {
    console.log('MESSAGE from ' + user + ' : ' + 'message');
  });

  socket.on('ping', () => {
    console.log('PING got: ');
    socket.emit('pong');
  });
});

server.listen(3333);
