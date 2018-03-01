var socket = io()


var email = $('#email_input')
var password = $('form').find("input:last")

socket.on('user loggedin', function (data) {
    console.log('identity confirmed')
    console.log(socket.id)
    sessionStorage.setItem('currentuser', JSON.stringify({
        username: data.username,
        email: data.email
    }))
    socket.emit('create namespace',data)
    location.replace('/landingpage.html')
})



function logIn() {
    console.log(email)

    var user = {
        'email': email.val(),
        'password': password.val()
    }
    socket.emit('sign in', user)
    console.log('user signed in ' + user.password + " " + user.email)
}