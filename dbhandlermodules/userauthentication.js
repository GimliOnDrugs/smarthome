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
    password: String
})



var User = mongoose.model('User', UserSchema)



exports.userSignUp = function (userName, userEmail, userPassword, socket) {
    socket.emit('signing up')
    password(userPassword).hash(function (err, hash) {
        if (err) {
            console.log('errore sign up '+err)
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
                    socket.emit('user saved',user)
                }
            })
        }

    })


}
exports.userLogIn = function (userEmail, userPassword, socket) {
    User.findOne({ 'email': userEmail }, function (error, result) {
        if (error) return new Error('errore query')
        else {
            password(userPassword).verifyAgainst(result.password, function (error, same) {
               if(error){
                   console.log(error)
               }
                if (same) {
                    console.log('user correct')
                    
                    socket.emit('user loggedin', result)
                }
                else {
                    
                    throw new Error('errore identità')
                }
            })
        }
    })

}