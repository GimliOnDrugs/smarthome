$(document).ready(function(){
    var user=JSON.parse(sessionStorage.getItem('currentuser'))
    console.log(user.username+" "+user.email)
    $('#userdisplayname').text("Welcome "+user.username)
})