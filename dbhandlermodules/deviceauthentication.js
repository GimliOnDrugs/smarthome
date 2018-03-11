var userAuth = require('./userauthentication')

exports.saveDevice = function (userName, device, domid, io, socketid) {
    userAuth.getUser.findOne({ 'username': userName }, function (error, result) {
        if (error) console.log(error)
        result.devices.push(device)
        result.save(function (error, result) {
            if (error) console.log(error)
            io.in(userName).to(socketid).emit('device saved', { device: device, domid: domid })
        })
    })
}
exports.fetchDevices = function (userName, socketid, io) {
    userAuth.getUser.findOne({ 'username': userName }, function (error, result) {
        if (error) console.log(error)

        io.in(userName).to(socketid).emit('devices fetched', result.devices)
    })
}

exports.saveStatus = function (username, status, ipaddress, socketid, io) {
    userAuth.getUser.findOne({ 'username': username }, function (error, result) {
        if (error) console.log(error)
        result.devices.forEach(element => {
            if (element.ipaddress === ipaddress) {
                element.status = status
            }

        });
        result.save(function (error, result) {
        })

    })
}

exports.findDeviceWhenConnect = function (devicename, username, socket) {
    userAuth.getUser.findOne({ 'username': username }, function (error, result) {
        if (error) console.log(error)
        result.devices.forEach(element => {
            if (element.name === devicename) {
                element.status = true

                socket.broadcast.emit('rpi', { devicename: devicename, username: username, ipaddress: element.ipaddress })

            }
        })
        result.save()
    })
}
exports.findDeviceWhenLeave = function (devicename, username, socket) {
    console.log('device name ' + devicename)
    userAuth.getUser.findOne({ 'username': username }, function (error, result) {
        if (error) console.log(error)
        result.devices.forEach(element => {
            if (element.name === devicename) {
                element.actionstatus = false
                element.status = false

            }
        })
        result.save(function (error, result) {
            result.devices.forEach(element => {
                if (element.name === devicename) { //questo evento è mandato a tutti i device tranne il client web (socket è innfatti il client)
                    socket.to(username).emit('leave room', { devicename: devicename, username: username, ipaddress: element.ipaddress })
                }
            })


        })
    })
}
exports.saveActionStatus = function (devicename, username, actionstatus, socket) {
    console.log('device name '+devicename)
    userAuth.getUser.findOne({ 'username': username }, function (error, result) {
        if (error) console.log(error)
        result.devices.forEach(element => {
            if (element.name === devicename && element.status) {
                element.actionstatus = actionstatus

            }
        })
        result.save(function (error, result) {
            if (error) console.log(error)
            socket.to(username).emit('turn on/off light', { light: actionstatus, devicename: devicename })




        })
    })
}

