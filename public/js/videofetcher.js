
var user = JSON.parse(localStorage.getItem('currentuser')) //properties: username

$(document).ready(function(){
    var urlVideoFetch = 'http://localhost:3000/videofetch?id=' + user.username 
                    $.ajax({

                        url: urlVideoFetch,
                        success: (data, status, xhr) => {
                            var files = data.files
                            var numberOfFiles = files.length
                            for (let i = 0; i < numberOfFiles; i++) {
                                var stringUrl = 'http://localhost:3000/videostream?id=' + user.username + '&video=' + files[i] + '&devicename='+deviceName+'' //this is for debug
                                //var stringUrl = 'https://smartsecurityhome.herokuapp.com/videostream?id=' + user.username + '&video=' + files[i] + '&devicename='+deviceName+'' //this is for debug
                                var video = '<video src="' + stringUrl + '" controls   ></video></div>'
                                $('#video_' + uniqueID).append(video)

                            }

                        }

                    })
})