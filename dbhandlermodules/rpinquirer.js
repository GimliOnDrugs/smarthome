var inquirer = require('inquirer')
var deviceauthentication = require('./deviceauthentication')
var userAuth=require('./userauthentication')
var rpiClient=require('../rpiclient')

var questions = [

    {
        type: 'input',
        name: 'email',
        message: 'E-mail: ',
        validate: (answer) => {

            return answer !== ''
        }
    },
    {
        type: 'password',
        name: 'password',
        message: 'Password: ',
        validate: (answer) => {
            return answer !== ''
        }
    },
    {
        type:'input',
        name:'devicename',
        message:'Device name: ',
        validate: (answer) => {
            return answer !== ''
        }

    }
]


exports.startRPIAuth = (socket) => inquirer.prompt(questions).then(answers => {

    var email = answers.email
    var password = answers.password
    var devicename=answers.devicename
    var user = {
        'email': email,
        'password': password,
        'devicename':devicename
    }
    socket.emit('sign in', user)
    rpiClient.setDeviceName(devicename)

})