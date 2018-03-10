
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var ip=require('ip')
var app = require('express')();
var io=require('socket.io-client')
var stringUrl="http://192.168.1.242:3000"
//var stringUrl="https://smartsecurityhome.herokuapp.com"
var user
var deviceName
var socket=io(stringUrl,{transports:['websocket']})


var ipAddress=ip.address()

socket.on('connect',function(){
console.log('connected')
console.log(socket.id)



socket.on('leave room',function(data){


if(data.ipaddress===ipAddress){
socket.emit('rpi leave room',data)
console.log('Im leaving the room :(')

socket.emit('save status on db',{ipaddress:ipAddress,status:false,username:data.username})
}
})


})

socket.on('ask for light status',function(data){
console.log('Im being asked about light status')

var isLedOn=LED.readSync()===1?true:false
socket.emit('light status',{ipaddress:ipAddress,username:user,domid:data,light:isLedOn})



})

socket.on('disconnect',function(){
console.log('disconnected '+socket.id)
socket.emit('leave room',{devicename:deviceName,username:user})
//socket.emit('save status on db',{ipaddress:ipAddress,status:false,username:user})


})

socket.on('reconnect',function(){
console.log('reconnected' )

})

socket.on('rpi',function(data){
console.log('my data: '+data.ipaddress)
if(ipAddress===data.ipaddress){
user=data.username
deviceName=data.devicename
console.log('i was found!')
socket.emit('room',data)
socket.emit('save status on db',{ipaddress:ipAddress,status:true,username:data.username})
}
else{
console.log('sorry its not me')
}
})



socket.on('turn on/off light',function(data){
    console.log('data arrived: '+data.light)
    if (LED.readSync() === 0 && data.light) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
    console.log('turnin on light')
     }
    else{

        LED.writeSync(0)
         console.log('turning off light')

        }
console.log(LED.readSync())
})

//socket.on('message',function(data){

//console.log(data.socketidsender+' said '+data.message+'in room: '+data.room)
//socket.emit('message',{socketidsender:socket.id,message:'ciao sono il rpi',
//room:data.room})
//})

