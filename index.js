
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });
var port = process.env.PORT || 3000;
var userauth = require('./dbhandlermodules/userauthentication')

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function (socket) {
 

  socket.on('sign up', function (data) {
    userauth.userSignUp(data.username,data.email, data.password, socket)
  })
  socket.on('sign in',function(data){
    userauth.userLogIn(data.email,data.password,socket)
  })
});

server.listen(port, function () {
  console.log('listening on *:' + port);

})
