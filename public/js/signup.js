var socket = io()
var email = $('#email_input')
var password = $('form').find("input:last")
var username=$('form').find("input:first")

socket.on('signing up', function () {
    $('<div class="loader submit-loader d-block mx-auto"></div>').insertAfter('#button_container')
})
socket.on('user saved', function (user) {
    $('.loader').remove()
    sessionStorage.setItem('currentuser',JSON.stringify({
        username: user.username,
        email: user.email
    }))
    location.replace('/landingpage.html')
})
socket.on('error save', function (errorcode) {

    console.log('error '+errorcode)
    $('.loader').remove()

    switch (errorcode) {
        case 11000:
            email.addClass('is-invalid')
            $('form').find('.invalid-feedback').first().text('e-mail already in use')
            break;
        default:
            break;
    }
})
function signUp() {
    console.log(email)

    var user = {
        'username': username.val(),
        'email': email.val(),
        'password': password.val()
    }
    socket.emit('sign up', user)
    console.log('user signed up '+user.username+" "+user.email)
}