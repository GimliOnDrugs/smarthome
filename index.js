
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var userauth = require('./dbhandlermodules/userauthentication')

app.use(express.static(path.join(__dirname, 'public')));

var user


io.on('connection', function (socket) {
  socket.on('sign up', function (data) {
    user = data
    userauth.userSignUp(data.username, data.email, data.password, socket)
  })
  socket.on('sign in', function (data) {
    user = data

    userauth.userLogIn(data.email, data.password, socket)
  })
socket.on('create namespace',(data)=>{
  var userIo=io.of('/'+data.username)
  userIo.on('connection',function(socket){
    console.log('user connected to namespace '+data.username)
  socket.emit('handshake',userIo.sockets)
  })
})

  socket.on('my event', function (data) {
    console.log(data.message + " sent to user: " + user.username)
  })
});

server.listen(port, function () {
  console.log('listening on *:' + port);

})
