
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });
var port = process.env.PORT || 3000;
var userauth = require('./dbhandlermodules/userauthentication')

app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', function (socket) {
  console.log('user connected ' + socket.id)
  socket.on('sign up', function (data) {
    user = data
    userauth.userSignUp(data.username, data.email, data.password, socket)
  })
  socket.on('sign in', function (data) {
    user = data

    userauth.userLogIn(data.email, data.password, socket)
  })

  socket.on('room', (data) => {
    /* userIo = io.of('/' + data.username)
    userIo.on('connection', function (socket) {
      console.log('connected to nsp james' + socket.id)
      socket.emit('handshake', data.username + " connected users: " + users)

      socket.on('disconnect', function (socket) {
        console.log('socket disconnected: ' + socket.id)
      })
    })
 */


    console.log(data + " is joining a room")

    socket.join(data)
    io.in(data).clients(function (error, clients) {
      if (error) throw error
      console.log(clients)
    })
    io.to(data).emit('room joined', { message: 'ciao!' })

  })


  socket.on('disconnect', function () {
    console.log('user disconnected ')
  })
});


server.listen(port, function () {
  console.log('listening on *:' + port);

})
