
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });
var port = process.env.PORT || 3000;
var userauth = require('./dbhandlermodules/userauthentication')

app.use(express.static(path.join(__dirname, 'public')));

var userIo

io.on('connection', function (socket) {
  socket.on('sign up', function (data) {
    user = data
    userauth.userSignUp(data.username, data.email, data.password, socket)
  })
  socket.on('sign in', function (data) {
    user = data

    userauth.userLogIn(data.email, data.password, socket)
  })
  socket.on('create namespace', (data) => {
    userIo = io.of('/' + data.username)

  })

  socket.on('my event', function (data) {
    console.log(data.message + " sent to user: " + user.username)
  })
});

var users = 0
userIo.on('connection', function (socket) {
  users++

  socket.emit('handshake', data.username + " connected users: " + users)
})
server.listen(port, function () {
  console.log('listening on *:' + port);

})
