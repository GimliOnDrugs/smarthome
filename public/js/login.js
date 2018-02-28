var socket=io()


var email = $('#email_input')
var password = $('form').find("input:last")

socket.on('user loggedin',function(data){
    console.log('identity confirmed')
})

function logIn() {
    console.log(email)

    var user = {
        'email': email.val(),
        'password': password.val()
    }
    socket.emit('sign in', user)
    console.log('user signed in '+user.password+" "+user.email)
}