const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3000);
const server = app.listen(port);

app.use(express.static('public'));

console.log(`Server is listening on port ${port}`);

const socket = require('socket.io');
const io = socket(server);

io.of('/client').on('connection', (socket) => {
  console.log('new client connection: ' + socket.id);

  io.emit('userJoined', { id: socket.id });

  socket.on('update', (data) => {
    io.emit('userUpdate', data);
  });

  socket.on('disconnect', (data) => {
    io.emit('userLeft', { id: socket.id });
  });
});

io.on('connection', (socket) => {
  console.log('new SHARED VIEW connection: ' + socket.id);
});
