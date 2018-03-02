
$(document).ready(function () {
    var user = JSON.parse(sessionStorage.getItem('currentuser'))
    var socket = io()
    socket.on('ciao',function(data){
        console.log(data)
    })
    console.log(user.username + " " + user.email)
    $('#userdisplayname').text("Welcome " + user.username)
    console.log(user.username)
    socket.emit('room',user.username)
    socket.on('room joined',function(data){
        console.log('room joined '+data.message+" socket id "+socket.id)
    })


})
/* var socket=io('/'+user.username)
 */

