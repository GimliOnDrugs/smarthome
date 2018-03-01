$(document).ready(function () {
    var user = JSON.parse(sessionStorage.getItem('currentuser'))
    var socket=io('/'+user.username)
    console.log(user.username + " " + user.email)
    $('#userdisplayname').text("Welcome " + user.username)
    
   

})
var socket=io('/'+user.username)
var user
socket.on('update connected clients', function(){
    user++
    console.log(user)
})

