var fs = require('fs')
var number = 0
var sum = 0
var lineReader = require('line-reader');

lineReader.eachLine('time_logs.txt', function (line, last) {
    var string = line.toString().trim()
    if (string != "NaN" && string != "") {

        number += 1
        sum += Number(string)
        console.log(sum)

    }
    if (last) {

        console.log(sum / number)
    }

});