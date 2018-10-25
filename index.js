const 
  server = require('http').createServer(),
  io = require('socket.io')(server),
  redis = require("redis"),
  ROOM = "GENERAL"
;

var redisSubscriber = redis.createClient({
    host: 'localhost',
    port: '16379',
});

var redisClient = redis.createClient({
    host: 'localhost',
    port: '16379',
});

// Redis pubsub
redisSubscriber.on('message', (channel, message) => {
  io.sockets.in(ROOM).emit('notify', message);
});

// SocketIO
let userCount = 0;
io.on('connect', (socket) => {
  console.log('connected');
  socket.join(ROOM);

  socket.on('join', ({ user }) => {
    console.log(`user ${user} joined:`);
    userCount++;

    io.sockets.in(ROOM).emit('MESSAGE_RECEIVED', { message: 'User ' + user + ' has joined the channel'});
    //redisClient.incr('users', (error, response) => {
    socket.emit('MESSAGE_RECEIVED', { message: `Currently there are ${userCount} users`});
    //});
  });

  socket.on('message', ({ user, message }) => {
    console.log('MESSAGE from ' + user + ' : ' + 'message : ' + message);
    io.sockets.in(ROOM).emit('MESSAGE_RECEIVED', { user, message });
  });

  socket.on('ping', () => {
    console.log('PING got: ');
    socket.emit('pong');
  });

  socket.on('disconnect', (request) => {
      userCount--;
      console.log('disconnected');
      console.log(request);
      io.sockets.in(ROOM).emit('MESSAGE', { message: `User ${userCount} has left the chat`});
      redisClient.decr('users');
  });

});

server.listen(3333);
