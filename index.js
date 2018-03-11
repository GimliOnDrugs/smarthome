var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });
var port = process.env.PORT || 3000;
var userauth = require('./dbhandlermodules/userauthentication')
var deviceAuth = require('./dbhandlermodules/deviceauthentication')
app.use(express.static(path.join(__dirname, 'public')));

io.set('transports', ['websocket']);

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


    console.log(socket.id + " is joining room " + data.username + ' from address ' + socket.handshake.address)
    var roomName = data.username
    socket.join(roomName)//socket joins room with id of username
    io.in(roomName).clients(function (error, clients) {
      if (error) throw error
      console.log(clients)
    })
    io.to(socket.id).emit('room joined', { roomjoined: roomName, id: socket.id})

  })





  socket.on('save status on db', function (data) {
    var ipAddress = data.ipaddress
    var username = data.username
    var statusDevice = data.status
    deviceAuth.saveStatus(username, statusDevice, ipAddress, socket.id)
  })
  socket.on('save device on database', function (data) {

    //call device authentication module
    console.log('socket id ' + socket.id)
    var ipAddress = data.ipaddress
    var actionDevice = data.action
    var statusDevice = false
    var domid = data.id
    var devicename = data.name
    deviceAuth.saveDevice(data.username, { name: devicename, ipaddress: ipAddress, action: actionDevice, status: statusDevice, position: 'random', actionstatus: false }, domid, io, socket.id)
/*     socket.broadcast.emit('rpi devicename', { ipaddress: ipAddress, devicename: data.name })
 */  })




  socket.on('fetch user devices', function (data) {
    var username = data.user
    deviceAuth.fetchDevices(username, socket.id, io)
  })

  socket.on('toggle light', function (data) {
    console.log(socket.id)
    deviceAuth.saveActionStatus(data.devicename, data.username, data.light, socket)
  })

  socket.on('connect rpi', (data) => { //before joining room, rpi needs to be found

    deviceAuth.findDeviceWhenConnect(data.devicename, data.username, socket)


  })
  socket.on('leave room', function (data) {
    io.in(data.username).clients(function (error, clients) {
      if (error) throw error
      console.log(clients)
    })   // socket.to(data.username).emit('leave room', data) //web socket send leave room to all rpi clients in room expect itself
    deviceAuth.findDeviceWhenLeave(data.devicename, data.username, socket)
  })

  socket.on('rpi leave room', function (data) { //event sent from rpi that needs to leave room
    socket.leave(data.username)
    socket.to(data.username).emit('rpi leave room', data)
  })


  socket.on('disconnect', function () {
    console.log('user disconnected ' + socket.id)

  })


});



server.listen(port, function () {
  console.log('listening on *:' + port);

})
