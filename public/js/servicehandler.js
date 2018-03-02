var socket = io()
var user = JSON.parse(sessionStorage.getItem('currentuser'))


$(document).ready(function () {

    console.log(user.username + " " + user.email)
    $('#userdisplayname').text("Welcome " + user.username)
    console.log(user.username)
    socket.emit('room', user.username)
    socket.on('room joined', function (data) {
        console.log('room joined ' + data.roomjoined + " by " + data.id)

    })



})
function onRegisterClick() {
    var firstInput=$('#first').val()
    var secondInput=$('#second').val()
    var thirdInput=$('#third').val()
    var fourthInput=$('#fourth').val()
    var ipAddressToSend=firstInput+'.'+secondInput+'.'+thirdInput+'.'+fourthInput
    console.log(ipAddressToSend)
    socket.emit('connect rpi', { ipaddress: '192.168.1.185', name: user.username })
}
/* var socket=io('/'+user.username)
 */

