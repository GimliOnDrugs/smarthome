
$(document).ready(function () {
    var user = JSON.parse(sessionStorage.getItem('currentuser'))
    var socket = io('/' + user.username)
    console.log(user.username + " " + user.email)
    $('#userdisplayname').text("Welcome " + user.username)
    var user=0

    socket.on('handshake', function () {
        user++
        console.log(user+" socket id: "+socket.id)
    })


})
/* var socket=io('/'+user.username)
 */

