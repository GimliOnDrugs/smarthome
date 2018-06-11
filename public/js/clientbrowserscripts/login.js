var socket = io({ transports: ['websocket'] })


var email = $('#email_input')
var password = $('form').find("input:last")

socket.on('user loggedin', function (data) {
    console.log('identity confirmed')
    console.log(socket.id)
    localStorage.setItem('currentuser', JSON.stringify({
        username: data.username,
        email: data.email
    }))
    location.replace('/landingpage.html')
})



function logIn() {

    var user = {
        'email': email.val(),
        'password': password.val()
    }
    socket.emit('sign in', user)
    console.log('user signed in ' + user.password + " " + user.email)
}