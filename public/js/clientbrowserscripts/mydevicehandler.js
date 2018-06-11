

var socket = io({ transports: ['websocket'] });
var user = JSON.parse(localStorage.getItem('currentuser')) //properties: username
var listHead = $('.list-group')

socket.on('connect', function () {

    console.log("I'm connecting " + socket.id + " to room " + user.username)
    socket.emit('room', { username: user.username})
})


socket.on('rpi connected', function (data) {


    var uniqueid = JSON.parse(sessionStorage.getItem(data.username))
    $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceon.svg')


})


socket.on('rpi leave room', function (data) {
    var uniqueid = JSON.parse(sessionStorage.getItem(data.username))

    $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceoff.svg')


})


socket.on('devices fetched', function (data) {
    for (var i = 0; i < data.length; i++) {
        var device = data[i]
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

        var domToAdd = '<li class="list-group-item " id="' + uniqueID + '"><div><div class="row justify-content-between"><div></div><span class="badge badge-pill badge-primary">1</span></div><div class=" row justify-content-center" style=" max-width: 1100px; margin-top: 20px;"><div class="col-auto col-center  "><img class="fab on-off" src="' + deviceOnOffImageUrl + '" onclick="onOnOffDeviceClick(\'' + uniqueID + '\')"><div class="col-auto col-center"><p class=" text-center d-block mx-auto my-auto  display-4" id="ipaddress" type="text">' + deviceName + '</p></div></div><div class="col-auto col-center  "><img class="fab" src="' + actionImageUrl + '" id="' + actiontype + '" onclick="goVideo()"></div><div class="col-auto col-center"><span class="checkbox"><input type="checkbox"  data-toggle="collapse" href="video_' + uniqueID + '" aria-expanded="true" aria-controls="video_' + uniqueID + '"><label data-on="ON" data-off="OFF"></label></span></div><div class="col-auto col-center  "><img class="fab" src="/css/assets/house.svg"></div><div class="col-auto col-center"><p class=" text-center d-block mx-auto my-auto  display-4" id="position" type="text">' + position + '</p></div></div></li>'
        var collapseToAdd = '<div class="collapse" id="video_' + uniqueID + '">'

        listHead.append(domToAdd)


        if (actiontype === 'video') {
            $('#' + uniqueID).append(collapseToAdd)
        }
        var toggle = $('#' + uniqueID + ' input')
        var deviceName = $('#' + uniqueID + ' #ipaddress').text()
        actionstatus ? toggle.prop('checked', true) : toggle.prop('checked', false)
        if (actiontype == 'light') {
            $('#' + uniqueID + ' input').change(function () {
                var uniqueID = $(this).closest('li').attr('id')
                var deviceName = $('#' + uniqueID + ' #ipaddress').text()
                var action = JSON.parse(sessionStorage.getItem(deviceName)).action
                console.log(deviceName + ' picked at uniqueid ' + uniqueID + ' with action ' + action)
                if (this.checked) {

                    socket.emit('toggle light', { devicename: deviceName, light: true, username: user.username, time: new Date().getMilliseconds() })
                }
                else {
                    socket.emit('toggle light', { devicename: deviceName, light: false, username: user.username })

                }
            })
        }
        else {
            $('#' + uniqueID + ' input').change(function () {
                var uniqueID = $(this).closest('li').attr('id')
                var deviceName = $('#' + uniqueID + ' #ipaddress').text()
                var action = JSON.parse(sessionStorage.getItem(deviceName)).action
                console.log(deviceName + ' picked at uniqueid ' + uniqueID + ' with action ' + action)
                if (this.checked) {

                    $('#video_' + uniqueID).toggle()
                    var urlVideoCount = 'https://smartsecurityhome.herokuapp.com/videoscount?id=' + user.username + '&devicename='+deviceName+''
                    //var urlVideoCount = 'http://localhost:3000/videoscount?id=' + user.username + '&devicename='+deviceName+''
                    $.ajax({

                        url: urlVideoCount,
                        success: (data, status, xhr) => {
                            var files = data.files
                            var numberOfFiles = files.length
                            for (let i = 0; i < numberOfFiles; i++) {
                                //var stringUrl = 'http://localhost:3000/videostream?id=' + user.username + '&video=' + files[i] + '&devicename='+deviceName+'' //this is for debug
                                var stringUrl = 'https://smartsecurityhome.herokuapp.com/videostream?id=' + user.username + '&video=' + files[i] + '&devicename='+deviceName+'' //this is for debug
                                var video = '<video src="' + stringUrl + '" controls   ></video></div>'
                                $('#video_' + uniqueID).append(video)

                            }

                        }

                    })

                }
                else {
                    $('#video_' + uniqueID).empty()

                    $('#video_' + uniqueID).toggle()
                    socket.emit('videos watched', { username: user.username,devicename: deviceName})

                }
            })
        }

        sessionStorage.setItem(deviceName, JSON.stringify({ uniqueid: uniqueID, action: actiontype }))
    }



})

socket.on('new video uploaded', (data) => {
    //update badge
    var deviceName = data.devicename
    var domElement = $('li:has(p:contains(' + data.devicename + '))').find('.badge')
    var currentNumber = Number(domElement.text())
    domElement.text(currentNumber + 1)
})

socket.on('rpi disconnect',function(data){
    var domElement = $('li:has(p:contains(' + data.devicename + '))').find('.fab').first()
    console.log(domElement)
    domElement.attr('src','/css/assets/deviceoff.svg')
})
$(document).ready(function () {

    socket.emit('fetch user devices', { user: user.username })



})

function onOnOffDeviceClick(uniqueid) {
    console.log(uniqueid)
    var deviceName = $('#' + uniqueid + ' #ipaddress').text()
    console.log('device name when switching on and off ' + deviceName)
    var buttontoggle = $('#' + uniqueid + ' input')
    var action = JSON.parse(sessionStorage.getItem(deviceName)).action
    if ($('#' + uniqueid + ' .on-off').attr('src') === '/css/assets/deviceon.svg') {

        action === 'light' ? socket.emit('toggle light', { devicename: deviceName, light: false, username: user.username }) : socket.emit('toggle video', { devicename: deviceName, video: false, username: user.username })

        socket.emit('leave room', { devicename: deviceName, username: user.username, id: uniqueid })
        $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceoff.svg')
        buttontoggle.prop('checked', false)
    }
    else {
        socket.emit('connect rpi', { devicename: deviceName, username: user.username, id: uniqueid })
        if (action === 'video') {
            socket.emit('toggle video', { devicename: deviceName, video: true, username: user.username })

        }
        $('#' + uniqueid + ' .on-off').attr('src', '/css/assets/deviceon.svg')

    }
}


function getUniqueID() {
    return Math.random().toString(36).substr(2, 16);
};
function goVideo(){
    location.replace('/videos.html')
}

