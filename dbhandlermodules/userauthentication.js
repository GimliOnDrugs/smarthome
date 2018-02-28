var dbConnection = require('./databaseconnection')
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt')

const saltRounds = 10;

var UserSchema = new Schema({
    username:{
        type:String,
        unique:true
    },
    email: {
        type: String,
        unique: true
    },
    password: String
})



var User = mongoose.model('User', UserSchema)



exports.userSignUp = function (userName,userEmail, userPassword, socket) {
    socket.emit('signing up')
    bcrypt.hash(userPassword, saltRounds, function (err, hash) {
        var user = new User({ username:userName,email: userEmail, password: hash })
        console.log("i'm signing up! " + user.email + " " + user.password)
        user.save(function (err,user) {
            console.log(err)
            if(err){
                console.log('error '+err)
                socket.emit('error save',err.code)
            }else{  
                console.log('correctly saved user '+user)
                socket.emit('user saved')
            }
        })
    })


}
exports.userLogIn = function (userEmail,userPassword,socket) {
    User.findOne({'email':userEmail},function(error,result){
        console.log(result)
        if(error) return new Error('errore query')
        else{
            bcrypt.compare(userPassword,result.password,function(error,same){
                if(same){
                    socket.emit('user loggedin',result)
                }
                else{
                    throw new Error('errore identità')
                }
            })
        }
    })

}