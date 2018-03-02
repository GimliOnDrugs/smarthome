
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


    console.log(socket.id + " is joining room "+data)

    socket.join(data)
    io.in(data).clients(function (error, clients) {
      if (error) throw error
      console.log(clients)
    })
    socket.broadcast.to(data).emit('room joined', {roomjoined:data, id: socket.id })
  })

/*   socket.on('message',function(data){
    console.log(data)
    socket.broadcast.to(data.room).emit('message',{socketidsender:socket.id,room:data.room,message:data.message})
  }) */

  socket.on('connect rpi', (data) => {

    console.log(data)

    socket.broadcast.emit('rpi',data)


  })


  socket.on('disconnect', function () {
    console.log('user disconnected '+socket.id)
  })
});


server.listen(port, function () {
  console.log('listening on *:' + port);

})
