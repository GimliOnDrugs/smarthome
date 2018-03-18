

var socket = io({ transports: ['websocket'] });
var user = JSON.parse(localStorage.getItem('currentuser')) //properties: username
var listHead = $('.list-group')

socket.on('connect', function () {
    
    console.log("I'm connecting "+socket.id+" to room "+user.username)
    socket.emit('room', { username: user.username })
})


socket.on('rpi connected', function (data) {


    var uniqueid = JSON.parse(sessionStorage.getItem(data.username))
    console.log(uniqueid)
    $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceon.svg')


})
socket.on('video sent', function(data){
    console.log('image arrived to bw')
    
})


socket.on('rpi leave room', function (data) {
    var uniqueid = JSON.parse(sessionStorage.getItem(data.username))

    $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceoff.svg')

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
        var uniqueID = getUniqueID()
        console.log(uniqueID + ' before')
        var domToAdd = '<li class="list-group-item " id="' + uniqueID + '"><div><div class=" row justify-content-center" style=" max-width: 1100px; margin-top: 20px;"><div class="col-auto col-center  "><img class="fab on-off" src="' + deviceOnOffImageUrl + '" onclick="onOnOffDeviceClick(\'' + uniqueID + '\')"><div class="col-auto col-center"><p class=" text-center d-block mx-auto my-auto  display-4" id="ipaddress" type="text">' + deviceName + '</p></div></div><div class="col-auto col-center  "><img class="fab" src="' + actionImageUrl + '" id="' + actiontype + '"></div><div class="col-auto col-center"><span class="checkbox"><input type="checkbox" ><label data-on="ON" data-off="OFF"></label></span></div><div class="col-auto col-center  "><img class="fab" src="/css/assets/house.svg"></div><div class="col-auto col-center"><p class=" text-center d-block mx-auto my-auto  display-4" id="position" type="text">' + position + '</p></div></div></li>'

        listHead.append(domToAdd)
        var toggle = $('#' + uniqueID + ' input')
        var deviceName = $('#' + uniqueID + ' #ipaddress').text()
        actionstatus ? toggle.prop('checked', true) : toggle.prop('checked', false)
        $('#' + uniqueID + ' input').change(function () {
            var uniqueID = $(this).closest('li').attr('id')
            console.log(uniqueID)
            var deviceName = $('#' + uniqueID + ' #ipaddress').text()
            console.log(deviceName)
            var action = JSON.parse(sessionStorage.getItem(deviceName)).action
            console.log(deviceName + ' picked at uniqueid ' + uniqueID + ' with action ' + action)
            if (this.checked) {

                action === 'Light' ? socket.emit('toggle light', { devicename: deviceName, light: true, username: user.username }) : socket.emit('toggle video', { devicename: deviceName, video: true, username: user.username })


            }
            else {
                action === 'Light' ? socket.emit('toggle light', { devicename: deviceName, light: false, username: user.username }) : socket.emit('toggle video', { devicename: deviceName, video: false, username: user.username })

            }
        })
        sessionStorage.setItem(deviceName, JSON.stringify({ uniqueid: uniqueID, action: action }))
    }
    console.log(sessionStorage.length)

})


$(document).ready(function () {

    socket.emit('fetch user devices', { user: user.username })



})

function onOnOffDeviceClick(uniqueid) {
    console.log(uniqueid)
    var deviceName = $('#' + uniqueid + ' #ipaddress').text()
    console.log('device name when switching on and off '+deviceName)
    var buttontoggle = $('#' + uniqueid + ' input')
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

function getUniqueID() {
    return Math.random().toString(36).substr(2, 16);
};

