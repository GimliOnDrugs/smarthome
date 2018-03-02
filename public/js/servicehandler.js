var socket = io()
var user = JSON.parse(sessionStorage.getItem('currentuser'))

/* socket.on('message', function (data) {
    console.log(data.socketidsender + ' is saying ' + data.message)
    socket.emit('message', { socketidsender: socket.id, message: 'hi im client!', room: JSON.parse(sessionStorage.getItem('currentroom')) })
})
 */

$(document).ready(function () {

    console.log(user.username + " " + user.email)
    $('#userdisplayname').text("Welcome " + user.username)
    console.log(user.username)
    socket.emit('room', user.username)
    socket.on('room joined', function (data) {
        console.log('room joined ' + data.roomjoined + " by " + data.id)
        sessionStorage.setItem('currentroom', JSON.stringify(data.roomjoined))

    })




})

function onRegisterClick() {
    var firstInput = $('#first').val()
    var secondInput = $('#second').val()
    var thirdInput = $('#third').val()
    var fourthInput = $('#fourth').val()
    var ipAddressToSend = firstInput + '.' + secondInput + '.' + thirdInput + '.' + fourthInput
    console.log(ipAddressToSend)
    socket.emit('connect rpi', { ipaddress: ipAddressToSend, name: user.username })
}
/* var socket=io('/'+user.username)
 */

/*  function onStartChatClick(){
    socket.emit('message', { socketidsender: socket.id, message: 'hi im client!', room: JSON.parse(sessionStorage.getItem('currentroom')) })

 } */

