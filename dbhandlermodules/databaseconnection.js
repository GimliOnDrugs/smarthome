var mongoose = require('mongoose')
mongoose.connect('mongodb://giacomo:metallaro93@ds245805.mlab.com:45805/smarthomedb');
var db = mongoose.connection;

exports.onConnectionOpen= db