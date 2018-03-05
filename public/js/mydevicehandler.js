

var socket = io({ transports: ['websocket'] });
var user = JSON.parse(sessionStorage.getItem('currentuser')) //properties: username
var listHead = $('.list-group')
socket.emit('room', { username: user.username })




$(document).ready(function () {
    socket.on('room joined', function (data) {
        sessionStorage.setItem('currentroom', JSON.stringify(user.username))
        socket.emit('fetch user devices', { user: user.username })
    })
    socket.on('devices fetched', function (data) {
        console.log(data)
        for (var i = 0; i < data.length; i++) {
            var device = data[i]
            console.log('for loop device ' + device)
            var deviceName = device.name
            var status = device.status
            var position = device.position
            var ipaddress = device.ipaddress
            var action = device.action
            var actionstatus = device.actionstatus
            var actionImageUrl = action === "Light" ? '/css/assets/lights.svg' : '/css/assets/videosurv.svg'
            var deviceOnOffImageUrl = status ? '/css/assets/deviceon.svg' : '/css/assets/deviceoff.svg'
            var actiontype = action === "Light" ? 'light' : 'video'
            var uniqueID = new Date().getTime()
            var domToAdd = '<li class="list-group-item " id="' + uniqueID + '"><div><div class=" row justify-content-center" style=" max-width: 1100px; margin-top: 20px;"><div class="col-auto col-center  "><img class="fab on-off" src="' + deviceOnOffImageUrl + '" onclick="onOnOffDeviceClick(' + uniqueID + ')"><div class="col-auto col-center"><p class=" text-center d-block mx-auto my-auto  display-4" id="ipaddress" type="text">' + deviceName + '</p></div></div><div class="col-auto col-center  "><img class="fab" src="' + actionImageUrl + '" id="' + actiontype + '"></div><div class="col-auto col-center"><span class="checkbox"><input type="checkbox" ><label data-on="ON" data-off="OFF"></label></span></div><div class="col-auto col-center  "><img class="fab" src="/css/assets/house.svg"></div><div class="col-auto col-center"><p class=" text-center d-block mx-auto my-auto  display-4" id="position" type="text">' + position + '</p></div></div></li>'
            listHead.append(domToAdd)
            var deviceName = $('#' + uniqueID + ' input')
            actionstatus ? deviceName.prop('checked', true) : deviceName.prop('checked', false)
            var deviceName = $('#' + uniqueID + ' #ipaddress').text()
            $('#' + uniqueID + ' input').change(function () {
                if (this.checked) {
                    socket.emit('toggle light', { devicename: deviceName, light: true, username: user.username })


                }
                else {
                    socket.emit('toggle light', { devicename: deviceName, light: false, username: user.username })

                }
            })
        }

    })

})

function onOnOffDeviceClick(uniqueid) {
    var deviceName = $('#' + uniqueid + ' #ipaddress').text()
    var buttontoggle = $('#' + uniqueid + ' input')
    console.log($('#' + uniqueid + ' #ipaddress'))
    if ($('#' + uniqueid + ' .on-off').attr('src') === '/css/assets/deviceon.svg') {
        socket.emit('toggle light', { devicename: deviceName, light: false, username: user.username })

        socket.emit('leave room', { devicename: deviceName, username: user.username, id: uniqueid })
        $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceoff.svg')
        buttontoggle.prop('checked', false)
    }
    else {
        socket.emit('connect rpi', { devicename: deviceName, username: user.username, id: uniqueid })
        $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceon.svg')

    }
}


