var inquirer = require('inquirer')
var userAuth = require('./userauthentication')


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
        'devicenaem':devicename
    }
    socket.emit('sign in', user)
    socket.emit('update ipaddress',user)
})