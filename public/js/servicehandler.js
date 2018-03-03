var socket = io()
var user = JSON.parse(sessionStorage.getItem('currentuser'))

/* socket.on('message', function (data) {
    console.log(data.socketidsender + ' is saying ' + data.message)
    socket.emit('message', { socketidsender: socket.id, message: 'hi im client!', room: JSON.parse(sessionStorage.getItem('currentroom')) })
})
 */
var lighton = false
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
function onDeviceAddClick() {
    var uniqueID = new Date().getTime()

    var deviceDomToAdd = '<li class="list-group-item "><div  id="' + uniqueID+ '"><div class=" row justify-content-center" style=" max-width: 1100px; margin-top: 20px;"><div class="row"><div class="col-auto col-center  "><p class="text-center d-block my-auto">I.P. Address</p></div><div class="col-4 col-center"><input class=" text-left d-block mx-auto my-auto form-control" id="ip_address" type="text" placeholder="192.168.1.345"></div></div><div class="col-auto col-center  "><div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><p class="dropdown-item">Light</p><p class="dropdown-item">Video</p></div></div></div></div><div class="row justify-content-between" style="margin-top:50px;"><div class="col"></div><div class="col-auto col-center"><img class="fab" src="/css/assets/checked.svg" onclick="onOkClick()"></div><div class="col-auto col-center"><img class="fab" src="/css/assets/cancel.svg" onclick="onCancelClick()"></div><div class="col"></div></div></div></li>'
    var list = $('.list-group')
    list.prepend(deviceDomToAdd)



}
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

function onToogleLight() {
    lighton = !lighton

    socket.emit('toggle light', { light: lighton, room: JSON.parse(sessionStorage.getItem('currentroom')) })
    $('#light').text(lighton === true ? 'on' : 'off')


}

