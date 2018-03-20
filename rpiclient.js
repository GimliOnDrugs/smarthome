
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var ip = require('ip')
var app = require('express')();
var io = require('socket.io-client')
var path = require('path');
var rpiInquirer = require('./dbhandlermodules/rpinquirer')
var PythonShell = require('python-shell')
var rpiInquirer = require('./dbhandlermodules/rpinquirer')
var fs = require('fs')
var http = require('http')
var stringUrl = "http://192.168.1.242:3000"
//var stringUrl = "https://smartsecurityhome.herokuapp.com"
var socket = io(stringUrl, { transports: ['websocket'] })
var ipAddress = ip.address()

var options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: '/usr/bin/python3'
}
var shell = new PythonShell('camerascript.py', options)
var user
var deviceName
var on = false


socket.on('connect', function () {
    console.log('connected')
    console.log(socket.id)

    if (typeof user === "undefined") {
        rpiInquirer.startRPIAuth(socket)
    }
    socket.on('error login', function (data) {
        console.log('The identity provided is wrong, please insert correct values')
        rpiInquirer.startRPIAuth(socket)

    })

    socket.on('user loggedin', function (data) {
        console.log('logging in ' + data.username)
        user = data.username
        console.log('username registered! ', user)
        socket.emit('room', { username: user })
    })



    socket.on('leave room', function (data) {


        if (data.ipaddress === ipAddress) {
            console.log('Im leaving the room :(')
            on = false

            socket.emit('save status on db', { ipaddress: ipAddress, status: false, username: data.username })
        }
    })


})



socket.on('disconnect', function () {
    console.log('\ndisconnected ')
    socket.emit('leave room', { devicename: deviceName, username: user })
    //socket.emit('save status on db',{ipaddress:ipAddress,status:false,username:user})


})

socket.on('reconnect', function () {
    console.log('reconnected')
    if (typeof user !== 'undefined')
        socket.emit('room', { username: user })
})

socket.on('rpi', function (data) {
    on = true
    console.log('my data: ' + data.ipaddress)
    if (ipAddress === data.ipaddress) {
        user = data.username
        deviceName = data.devicename
        console.log('i was found!')
        socket.emit('room', data)
        socket.emit('save status on db', { ipaddress: ipAddress, status: true, username: data.username })
    }
    else {
        console.log('sorry its not me')
    }
})



socket.on('turn on/off light', function (data) {

    if (LED.readSync() === 0 && data.light && deviceName === data.devicename && on) { //check the pin state, if the state is 0 (or off)
        console.log('data arrived: ' + data.light)
        LED.writeSync(1); //set pin state to 1 (turn LED on)
        console.log('turning on light')
    }
    else if (deviceName === data.devicename && on) {

        LED.writeSync(0)
        console.log('turning off light')

    }
})

socket.on('turn on/off video', function (data) {//properties video:bool, devicename:string

    if (data.video && deviceName === data.devicename && on) { //check if device is on before working
        console.log('data arrived: ' + data.video)
        console.log('turning on video')
        shell = new PythonShell('camerascript.py', options)

        shell.send('take pic')
        shell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            if (message === 'pic taken') {
                //socket stream
                console.log('python working message')
                var postData = JSON.stringify({
                    msg: 'hello world'
                });

                var options = {
                    host:'"http://192.168.1.242',
                    port:3000,
                    method: 'POST',
                    path: '/videostream',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': postData.length
                    }
                };

                var req = http.request(options, function (res) {
                    console.log('STATUS:', res.statusCode);
                    console.log('HEADERS:', JSON.stringify(res.headers));

                    res.setEncoding('utf8');

                    res.on('data', function (chunk) {
                        console.log('BODY:', chunk);
                    });

                    res.on('end', function () {
                        console.log('No more data in response.');
                    });
                });

                req.on('error', function (e) {
                    console.log('Problem with request:', e.message);
                });
                //socketstream(socket).emit('sending pic', stream, {})
            }
        });
    }
    else if (deviceName === data.devicename && on) {

        console.log('turning off video')

    }
})


