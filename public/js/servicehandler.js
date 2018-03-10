var socket = io({transports: ['websocket']});
var user = JSON.parse(sessionStorage.getItem('currentuser'))



socket.on('device saved',function(data){
    console.log('device saved '+data)
    var uniqueID=data.domid
    var domToAdd='<li class="list-group-item device-added-feedback" id="'+uniqueID+'"><div class="d-flex w-100 justify-content-center"><div class="row justify-content-between" style="max-width: 900px;"><div class="col-auto d-block my-auto"><p class="text-center display-4">Device Aggiunto!</p></div><div class="col d-block my-auto"><img class="icon fab" src="/css/assets/checked.svg" onclick="onDeviceAddClick()"></div></div></div></li>'
    $('#'+uniqueID).replaceWith(domToAdd)

})
$(document).ready(function () {

    console.log(user.username + " " + user.email)
    $('#userdisplayname').text("Welcome " + user.username)
    console.log(user.username)
    socket.emit('room', user)
  




})
function onDeviceAddClick() {
    var uniqueID = new Date().getTime()
    $('.device-added-feedback').remove()

    var deviceDomToAdd = '<li class="list-group-item " id="' + uniqueID+ '"><div  ><div class=" row justify-content-center" style=" max-width: 1100px; margin-top: 20px;"><div class="row"><div class="col-auto col-center  "><p class="text-center d-block my-auto">I.P. Address</p></div><div class="col-4 col-center"><input class=" text-left d-block mx-auto my-auto form-control" id="ip_address" type="text" placeholder="192.168.1.345"></div></div><div class="col-auto col-center  "><p class="text-center d-block my-auto">Device Name</p></div><div class="col-4 col-center"><input class=" text-left d-block mx-auto my-auto form-control" id="device_name" type="text" placeholder="My Cool Device Name"></div><div class="col-auto col-center  "><div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="drop_'+uniqueID+'">Action</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><p class="dropdown-item" onclick="setActionLight('+uniqueID+')">Light</p><p class="dropdown-item" onclick="setActionVideo('+uniqueID+')">Video</p></div></div></div></div><div class="row justify-content-between" style="margin-top:50px;"><div class="col"></div><div class="col-auto col-center"><img class="fab" src="/css/assets/checked.svg" onclick="onOkClick('+uniqueID+')"></div><div class="col-auto col-center"><img class="fab" src="/css/assets/cancel.svg" onclick="onCancelClick('+uniqueID+')"></div><div class="col"></div></div></div></li>'
    var list = $('.list-group')
    list.append(deviceDomToAdd)



}
function onCancelClick(uniqueID){
    $('#'+uniqueID).remove()
}
function onOkClick(uniqueID){
    var ipAddressToSend=$('#'+uniqueID+' #ip_address').val()
    var deviceNameToSend=$('#'+uniqueID+' #device_name').val()
    console.log('about to set ipaddress '+ipAddressToSend)
    var actionToSend=$('#drop_'+uniqueID).text()
    
    socket.emit('save device on database',{ name:deviceNameToSend,ipaddress: ipAddressToSend, username: user.username,action:actionToSend,id:uniqueID})
    //

}
function setActionLight(uniqueID){

    $('#drop_'+uniqueID).text("Light")



}
function setActionVideo(uniqueID){
    $('#drop_'+uniqueID).text("Video")
}
/* function onRegisterClick() {
    var firstInput = $('#first').val()
    var secondInput = $('#second').val()
    var thirdInput = $('#third').val()

    var fourthInput = $('#fourth').val()
    var ipAddressToSend = firstInput + '.' + secondInput + '.' + thirdInput + '.' + fourthInput
    console.log(ipAddressToSend)
} */


