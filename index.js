
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });
var port = process.env.PORT || 3000;
var userauth = require('./dbhandlermodules/userauthentication')
var deviceAuth = require('./dbhandlermodules/deviceauthentication')
var fs = require('fs')
var shellFs = require('shelljs')


app.use(express.static(path.join(__dirname, 'public')));

//streaming section

app.post('/postvideo', function (req, res, next) {//post method from rpi
  console.log('streaming received')
  var user = req.header('username')
  console.log('post: ' + req.query.devicename)
  var date = new Date()
  var time = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes()+'-'+date.getSeconds()
  var fileName = 'motion_' + time + '.mp4'
  req.pipe(fs.createWriteStream(path.join(__dirname, 'users/' + user + '/' + fileName)));

  req.on('end', next);
});
app.get('/videoscount', function (req, res, next) { //get method from browser client to get the videos files
  console.log('How many videos in ' + req.query.id + '?')
  var user = req.query.id
  var pathFile = path.join(__dirname, 'users/' + req.query.id + '/')
  fs.readdir(pathFile, (error, files) => {
    if (files) {
      console.log('files length ' + files.length)
      res.json({
        files: files

      })
    }
    else {
      console.log('no file')
      res.send('no file yet')
    }

  })
})
app.get('/videostream', function (req, res, next) {

  var user = req.query.id
  var fileName = req.query.video
  console.log('this is filename ' + fileName)
  var pathFile = path.join(__dirname, 'users/' + req.query.id + '/' + fileName)
  var stat = fs.statSync(pathFile);

  var fileSize = stat.size;


  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(pathFile, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
    res.on('finish', () => {
      console.log('fully downloaded by client')
    })
  } else {

  }

})



io.set('transports', ['websocket']);

io.on('connection', function (socket) {
  console.log('user connected ' + socket.id)
  socket.on('sign up', function (data) {
    userauth.userSignUp(data.username, data.email, data.password, socket)

  })
  socket.on('sign in', function (data) {
    console.log('signing in ', socket.id)
    userauth.userLogIn(data.email, data.password, socket)
  })


  socket.on('update ipaddress', function (data) {
    console.log('updating ip address of: ' + data.devicename)
    var deviceName = data.devicename
    var userEmail = data.email
    var ipaddress = socket.handshake.address.split('::ffff:')[1]
    console.log(ipaddress)
    deviceAuth.updateIpAddress(userEmail, deviceName, ipaddress, socket)
  })


  socket.on('room', (data) => {
    console.log(data.username)
    var pathUser = path.join(__dirname, 'users/' + data.username + '/')
    shellFs.mkdir('-p', pathUser)

    console.log(socket.id + " is joining room " + data.username + ' from address ' + socket.handshake.address)
    var roomName = data.username
    socket.join(roomName)//socket joins room with id of username
    io.in(roomName).clients(function (error, clients) {
      if (error) throw error
      console.log(clients)
    })
    socket.emit('room joined', { roomjoined: roomName, id: socket.id })

  })





  socket.on('save status on db', function (data) {
    var ipAddress = data.ipaddress
    var username = data.username
    var statusDevice = data.status
    io.in(username).clients(function (error, clients) {
      if (error) throw error
      console.log('remaining clients ' + clients)
    })


    console.log('save on db ', socket.handshake.address)
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
  })




  socket.on('fetch user devices', function (data) {
    var username = data.user
    deviceAuth.fetchDevices(username, socket.id, io)
  })

  socket.on('toggle light', function (data) {
    console.log('light toggled ' + socket.id)
    deviceAuth.saveActionStatusLight(data.devicename, data.username, data.light, socket)
  })
  socket.on('toggle video', function (data) {//properties: devicename,video,username
    console.log(socket.id)
    deviceAuth.saveActionStatusVideo(data.devicename, data.username, data.video, socket)


  })

  socket.on('connect rpi', (data) => { //before joining room, rpi needs to be found

    deviceAuth.findDeviceWhenConnect(data.devicename, data.username, socket)


  })
  socket.on('leave room', function (data) {
    io.in(data.username).clients(function (error, clients) {
      if (error) throw error

      console.log(clients)
    })
    deviceAuth.findDeviceWhenLeave(data.devicename, data.username, socket)
  })


  socket.on('disconnect', function () {
    console.log('user disconnected ' + socket.id)

  })

  socket.on('video uploaded', (data) => {
    console.log('rpi uploaded video')
    socket.to(data.roomname).emit('new video uploaded')
  })



});



server.listen(port, function () {
  console.log('listening on *:' + port);

}) 
