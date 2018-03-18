var dbConnection = require('./databaseconnection')
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var password = require('password-hash-and-salt');
const saltRounds = 10;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    devices: [{ name: String, ipaddress: String, action: String, status: Boolean, position: String, actionstatus: Boolean }]
})




var User = mongoose.model('User', UserSchema)

exports.getUser = User

exports.userSignUp = function (userName, userEmail, userPassword, socket) {
    socket.emit('signing up')
    password(userPassword).hash(function (err, hash) {
        if (err) {
            console.log('errore sign up ' + err)
        }
        else {
            var user = new User({ username: userName, email: userEmail, password: hash })
            console.log("i'm signing up! " + user.email + " " + user.password)
            user.save(function (err, user) {
                console.log(err)
                if (err) {
                    console.log('error ' + err)
                    socket.emit('error save', err.code)
                } else {
                    console.log('correctly saved user ' + user)
                    socket.emit('user saved', user)
                }
            })
        }

    })


}
exports.userLogIn = function (userEmail, userPassword, socket) {
    console.log('in auth')
    User.findOne({ 'email': userEmail }, function (error, result) {
        console.log('result ', result === null)
        if (error) {
            console.log('email ' + error)
            socket.emit('error login', 'error')
            //  return new Error('errore query')

        }
        if (result === null) {
            console.log('Im emitting')
            socket.emit('error login', 'error')

        }
        else {
            password(userPassword).verifyAgainst(result.password, function (error, same) {
                if (error) {

                    socket.emit('error log in', result)

                }
                if (same) {
                    console.log('user correct')

                    socket.emit('user loggedin', result)

                }
                else {

                    socket.emit('error login', 'error')
                }
            })
        }
    })


}

